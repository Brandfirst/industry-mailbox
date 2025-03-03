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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    const { accountId, debug = false, verbose = false } = requestData;
    
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
    
    // For demo/testing, simulate fetching emails
    // In a real app, you would use the account's access_token to fetch real emails
    // from the provider's API (Gmail, Outlook, etc.)
    
    // Default emails to be fetched (can be replaced with actual API call)
    if (verbose) {
      console.log(`Fetching emails for ${accountData.email}`);
    }

    // In real implementation, call Gmail API using the access token
    // For this demo, we're using mock data
    let emails = [];
    let errorFetchingEmails = null;
    
    try {
      if (accountData.provider === 'gmail') {
        // In a real implementation, fetch emails from Gmail API
        // For now, use some mock data
        emails = [
          {
            id: '123',
            subject: 'Your Weekly Tech Newsletter',
            sender: 'tech-news@example.com',
            date: new Date().toISOString(),
            html: '<div>Some newsletter content</div>',
            snippet: 'Latest tech news and updates...'
          },
          {
            id: '124',
            subject: 'Daily News Digest',
            sender: 'news@daily.com',
            date: new Date().toISOString(),
            html: '<div>Some more newsletter content</div>',
            snippet: 'Top stories of the day...'
          },
          {
            id: '125',
            subject: 'Marketing Tips',
            sender: 'marketing@tips.com',
            date: new Date().toISOString(),
            html: '<div>Marketing newsletter content</div>',
            snippet: 'Improve your marketing strategy...'
          },
          // Fetch real emails from Gmail API here
        ];
        
        // In a real implementation, we would fetch actual emails:
        // 1. Use accountData.access_token to authenticate to Gmail API
        // 2. Fetch messages with labels like CATEGORY_PROMOTIONS or matching search criteria
        // 3. Process each message to extract needed data

        if (verbose) {
          console.log(`Would normally fetch emails from Gmail API using access token: ${accountData.access_token.substring(0, 10)}...`);
          console.log(`For testing, using ${emails.length} mock newsletter emails`);
        }
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
    
    // Filter for newsletters based on content/sender
    if (verbose) {
      console.log(`Filtering ${emails.length} emails for newsletters`);
    }
    
    const newsletters = emails.filter(email => isLikelyNewsletter(email, verbose));
    
    if (verbose) {
      console.log(`Found ${newsletters.length} newsletters out of ${emails.length} emails`);
    }
    
    // Process and save newsletters
    const synced = [];
    const failed = [];
    
    for (const newsletter of newsletters) {
      try {
        // Check if newsletter already exists to avoid duplicates
        const { data: existingData } = await supabase
          .from('newsletters')
          .select('id')
          .eq('email_id', accountId)
          .eq('gmail_message_id', newsletter.id)  // CHANGED: Use gmail_message_id instead of message_id
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
          gmail_message_id: newsletter.id,  // CHANGED: Use gmail_message_id instead of message_id
          title: newsletter.subject,
          sender_email: newsletter.sender,
          sender: newsletter.sender,  // Add this for display name
          content: newsletter.html || newsletter.snippet || '',
          published_at: newsletter.date,
          preview: newsletter.snippet || '',  // Add preview field
          // Add more fields as needed
        };
        
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
          mock: true // For demo purposes
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
