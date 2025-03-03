
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NEWSLETTER_KEYWORDS = [
  'newsletter', 'digest', 'update', 'bulletin', 'roundup', 'weekly', 'monthly', 
  'insights', 'trends', 'news', 'briefing', 'report', 'summary', 'highlights',
  'inbox', 'edition', 'latest', 'issue', 'special', 'exclusive'
];

// Updated to be more inclusive
const isLikelyNewsletter = (email: any, verbose = false) => {
  // Destructure with fallbacks for various email formats
  const { 
    subject = '',
    title = '',
    snippet = '',
    html = '',
    textBody = '',
    bodyText = '',
    sender = '',
    from = '',
    sender_email = '',
    from_email = ''
  } = email;
  
  const fullSubject = (subject || title || '').toLowerCase();
  const bodyText1 = (snippet || textBody || bodyText || '').toLowerCase();
  const bodyText2 = html ? html.toLowerCase() : '';
  const senderEmail = (sender || from || sender_email || from_email || '').toLowerCase();
  
  if (verbose) {
    console.log('Email details for newsletter detection:', {
      subject: fullSubject,
      senderEmail,
      hasHtml: !!html,
      bodySnippet: bodyText1.substring(0, 100) + '...',
    });
  }
  
  // 1. Check if the email appears to be a newsletter by keywords in subject
  for (const keyword of NEWSLETTER_KEYWORDS) {
    if (fullSubject.includes(keyword)) {
      if (verbose) console.log(`Newsletter detected by subject keyword: ${keyword}`);
      return true;
    }
  }
  
  // 2. Check if sender contains common newsletter indicators
  if (
    senderEmail.includes('newsletter') || 
    senderEmail.includes('noreply') || 
    senderEmail.includes('no-reply') ||
    senderEmail.includes('updates') ||
    senderEmail.includes('info@') ||
    senderEmail.includes('news@') ||
    senderEmail.includes('mail@')
  ) {
    if (verbose) console.log(`Newsletter detected by sender email pattern: ${senderEmail}`);
    return true;
  }
  
  // 3. Check body text for newsletter indicators
  const bodyFullText = bodyText1 + ' ' + bodyText2;
  
  // Check for unsubscribe links which are common in newsletters
  if (
    bodyFullText.includes('unsubscribe') || 
    bodyFullText.includes('opt out') || 
    bodyFullText.includes('opt-out') ||
    bodyFullText.includes('email preferences') ||
    bodyFullText.includes('manage subscriptions')
  ) {
    if (verbose) console.log('Newsletter detected by unsubscribe text in body');
    return true;
  }
  
  // 4. If the email has HTML content and looks formatted (not just plain text)
  if (html && (
    html.includes('<table') || 
    html.includes('<div style') || 
    (html.match(/<img/g) || []).length > 1)  // Multiple images often indicate a newsletter
  ) {
    if (verbose) console.log('Newsletter detected by HTML formatting patterns');
    return true;
  }
  
  if (verbose) console.log('Not detected as a newsletter');
  return false;
};

async function fetchGmailEmails(accessToken, verbose = false) {
  if (verbose) {
    console.log(`Fetching emails from Gmail API with token: ${accessToken.substring(0, 10)}...`);
  }
  
  try {
    // First, let's get the user's email address
    const userInfoResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json();
      console.error('Error fetching Gmail user profile:', errorData);
      throw new Error(`Gmail API profile error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const userInfo = await userInfoResponse.json();
    if (verbose) {
      console.log(`Fetching emails for Gmail user: ${userInfo.emailAddress}`);
    }
    
    // Get list of message IDs
    const listResponse = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=category:promotions OR category:updates OR is:newsletter OR unsubscribe', 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    if (!listResponse.ok) {
      const errorData = await listResponse.json();
      console.error('Error fetching Gmail message list:', errorData);
      throw new Error(`Gmail API list error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const messageList = await listResponse.json();
    
    if (!messageList.messages || messageList.messages.length === 0) {
      if (verbose) {
        console.log('No messages found in Gmail');
      }
      return [];
    }
    
    if (verbose) {
      console.log(`Found ${messageList.messages.length} messages, fetching details`);
    }
    
    // Fetch details for each message
    const emails = [];
    
    for (const message of messageList.messages.slice(0, 20)) { // Limit to 20 messages to avoid rate limits
      const messageResponse = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (!messageResponse.ok) {
        console.error(`Error fetching details for message ${message.id}`, await messageResponse.text());
        continue;
      }
      
      const messageData = await messageResponse.json();
      
      // Extract headers
      const headers = messageData.payload.headers.reduce((acc, header) => {
        acc[header.name.toLowerCase()] = header.value;
        return acc;
      }, {});
      
      // Extract body
      let html = '';
      let plainText = '';
      
      if (messageData.payload.parts) {
        for (const part of messageData.payload.parts) {
          if (part.mimeType === 'text/html' && part.body.data) {
            html = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } else if (part.mimeType === 'text/plain' && part.body.data) {
            plainText = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
          } else if (part.parts) {
            // Handle nested parts
            for (const subpart of part.parts) {
              if (subpart.mimeType === 'text/html' && subpart.body.data) {
                html = atob(subpart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
              } else if (subpart.mimeType === 'text/plain' && subpart.body.data) {
                plainText = atob(subpart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
              }
            }
          }
        }
      } else if (messageData.payload.body && messageData.payload.body.data) {
        // Handle single-part messages
        if (messageData.payload.mimeType === 'text/html') {
          html = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        } else if (messageData.payload.mimeType === 'text/plain') {
          plainText = atob(messageData.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        }
      }
      
      const email = {
        id: messageData.id,
        threadId: messageData.threadId,
        subject: headers.subject || '',
        sender: headers.from || '',
        sender_email: headers.from ? headers.from.match(/<(.+)>/) ? headers.from.match(/<(.+)>/)[1] : headers.from : '',
        date: new Date(parseInt(messageData.internalDate)).toISOString(),
        html: html,
        snippet: messageData.snippet || plainText.substring(0, 200),
        labelIds: messageData.labelIds || [],
      };
      
      emails.push(email);
    }
    
    if (verbose) {
      console.log(`Successfully fetched ${emails.length} emails from Gmail API`);
    }
    
    return emails;
  } catch (error) {
    console.error('Error fetching emails from Gmail API:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    const { accountId, debug = false, verbose = false, import_all_emails = false } = requestData;
    
    if (!accountId) {
      console.error('No accountId provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No account ID provided' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (verbose) {
      console.log(`Starting sync for account ${accountId} with debug=${debug}, verbose=${verbose}`);
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get email account details
    const { data: accountData, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    
    if (accountError) {
      console.error('Error fetching email account:', accountError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email account not found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (verbose) {
      console.log(`Found account: ${accountData.email} (${accountData.provider})`);
    }
    
    // Update last_sync timestamp to show we're attempting a sync
    await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);
    
    // Fetch emails from the actual Gmail API
    let emails = [];
    let errorFetchingEmails = null;
    
    try {
      if (accountData.provider === 'gmail') {
        // Use the access token to fetch emails from Gmail API
        emails = await fetchGmailEmails(accountData.access_token, verbose);
        
        if (verbose) {
          console.log(`Fetched ${emails.length} emails from Gmail API for ${accountData.email}`);
        }
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Provider ${accountData.provider} is not supported` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      errorFetchingEmails = error.message;
    }
    
    if (errorFetchingEmails) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to retrieve emails: ${errorFetchingEmails}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Filter for newsletters based on content/sender or import all if requested
    if (verbose) {
      console.log(`Filtering ${emails.length} emails for newsletters (import_all_emails=${import_all_emails})`);
    }
    
    let newsletters = emails;
    if (!import_all_emails) {
      newsletters = emails.filter(email => isLikelyNewsletter(email, verbose));
    }
    
    if (verbose) {
      console.log(`Found ${newsletters.length} newsletters out of ${emails.length} emails`);
    }
    
    // Process and save newsletters
    const synced = [];
    const failed = [];
    
    for (const newsletter of newsletters) {
      try {
        // Check if newsletter already exists to avoid duplicates
        if (verbose) {
          console.log(`Checking if newsletter ${newsletter.id} already exists...`);
        }
        
        const { data: existingData } = await supabase
          .from('newsletters')
          .select('id')
          .eq('email_id', accountId)
          .eq('gmail_message_id', newsletter.id)
          .maybeSingle();
        
        if (existingData) {
          if (verbose) {
            console.log(`Newsletter ${newsletter.id} already exists, skipping`);
          }
          continue;
        }
        
        // Prepare newsletter data
        const newsletterData = {
          email_id: accountId,
          gmail_message_id: newsletter.id,
          gmail_thread_id: newsletter.threadId,
          title: newsletter.subject,
          sender_email: newsletter.sender_email,
          sender: newsletter.sender,
          content: newsletter.html || newsletter.snippet || '',
          published_at: newsletter.date,
          preview: newsletter.snippet || '',
        };
        
        if (verbose) {
          console.log(`Inserting newsletter:`, {
            id: newsletter.id,
            title: newsletterData.title,
            sender: newsletterData.sender
          });
        }
        
        // Insert newsletter into database
        const { data, error } = await supabase
          .from('newsletters')
          .insert(newsletterData)
          .select()
          .single();
        
        if (error) {
          console.error(`Error saving newsletter ${newsletter.id}:`, error);
          failed.push({
            id: newsletter.id,
            error: error.message
          });
        } else {
          if (verbose) {
            console.log(`Saved newsletter: ${data.title}`);
          }
          synced.push(data);
        }
      } catch (error) {
        console.error(`Error processing newsletter ${newsletter.id}:`, error);
        failed.push({
          id: newsletter.id,
          error: error.message
        });
      }
    }
    
    // Determine partial success
    const partial = failed.length > 0 && synced.length > 0;
    
    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        partial,
        count: synced.length,
        synced,
        failed: failed.length > 0 ? failed : [],
        warning: partial ? 'Some newsletters failed to sync' : null,
        details: debug ? {
          accountEmail: accountData.email,
          provider: accountData.provider,
          totalEmails: emails.length,
          newslettersFound: newsletters.length,
          syncedCount: synced.length,
          failedCount: failed.length
        } : null,
        debugInfo: debug ? {
          timestamp: new Date().toISOString(),
          accountId,
          emailsProcessed: emails.length,
          mock: false
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in sync-emails function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unexpected error: ${error.message}`,
        details: { stack: error.stack }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
