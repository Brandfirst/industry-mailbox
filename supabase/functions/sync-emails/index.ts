// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Module for handling token authentication and refresh
async function refreshGoogleToken(refresh_token, accountId, supabase) {
  if (!refresh_token) {
    console.error('No refresh token available for account', accountId);
    throw new Error('No refresh token available to refresh access');
  }

  try {
    console.log(`Attempting to refresh token for account ${accountId} with refresh token: ${refresh_token.substring(0, 10)}...`);
    
    // Get Google client credentials from env
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      throw new Error('Google credentials not configured: ' + (!clientId ? 'Missing client ID' : 'Missing client secret'));
    }
    
    // Exchange refresh token for a new access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Error refreshing Google token, HTTP status:', tokenResponse.status, 'Response:', errorText);
      try {
        const tokenData = JSON.parse(errorText);
        throw new Error(`Failed to refresh token: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`Failed to refresh token: HTTP ${tokenResponse.status} - ${errorText || 'No response details'}`);
      }
    }
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('No access token in refresh response:', tokenData);
      throw new Error('No access token in refresh response');
    }
    
    const { access_token, expires_in } = tokenData;
    
    // Update the account with the new access token
    const updatePayload = { 
      access_token,
      last_token_refresh: new Date().toISOString()
    };
    
    console.log(`Updating token for account ${accountId}. Token updated payload prepared.`);
    
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update(updatePayload)
      .eq('id', accountId);
      
    if (updateError) {
      console.error('Error updating access token in database:', updateError);
      throw new Error(`Failed to save refreshed token: ${updateError.message}`);
    }
    
    console.log(`Successfully refreshed token for account ${accountId}. New token starts with: ${access_token.substring(0, 10)}...`);
    return access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error(`Token refresh failed: ${error.message}`);
  }
}

// Module for handling Gmail API requests
async function makeGmailApiRequest(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Return a special object indicating we need to refresh the token
    return { needsRefresh: true, response };
  }
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`Gmail API error (${url}):`, errorData);
    throw new Error(`Gmail API error: ${errorData.error?.message || `HTTP ${response.status}`}`);
  }
  
  return { data: await response.json(), needsRefresh: false };
}

// Function to decode Gmail API content data
function decodeGmailContent(rawData) {
  // Replace Gmail-specific characters and decode
  const normalizedData = rawData.replace(/-/g, '+').replace(/_/g, '/');
  
  try {
    // Use TextDecoder for proper UTF-8 handling
    const decoded = atob(normalizedData);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  } catch (error) {
    console.error("Error decoding content:", error);
    // Fallback to simple decoding
    return atob(normalizedData);
  }
}

// Extract email content from Gmail message parts
function extractEmailContent(messageData) {
  let html = '';
  let plainText = '';
  
  // Process message parts recursively
  function processMessagePart(part) {
    if (!part) return;
    
    if (part.mimeType === 'text/html' && part.body?.data) {
      html = decodeGmailContent(part.body.data);
    } else if (part.mimeType === 'text/plain' && part.body?.data) {
      plainText = decodeGmailContent(part.body.data);
    } else if (part.parts) {
      // Handle nested parts
      part.parts.forEach(subpart => processMessagePart(subpart));
    }
  }
  
  // Start with the message payload
  if (messageData.payload) {
    // Handle multipart messages
    if (messageData.payload.parts) {
      messageData.payload.parts.forEach(part => processMessagePart(part));
    } 
    // Handle single-part messages
    else if (messageData.payload.body && messageData.payload.body.data) {
      const content = decodeGmailContent(messageData.payload.body.data);
      if (messageData.payload.mimeType === 'text/html') {
        html = content;
      } else if (messageData.payload.mimeType === 'text/plain') {
        plainText = content;
      }
    }
  }
  
  // Ensure HTML content has proper UTF-8 declarations
  if (html && !html.includes('<meta charset="utf-8">')) {
    // Improve HTML structure as needed
    html = ensureProperHtmlStructure(html);
  }
  
  return { html, plainText };
}

// Ensure HTML has proper document structure
function ensureProperHtmlStructure(html) {
  // Check if HTML has a DOCTYPE declaration
  if (!html.trim().toLowerCase().startsWith('<!doctype')) {
    return `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              </head>
              <body>${html}</body>
            </html>`;
  } else {
    // If it has a doctype, check for head tags
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      // Add meta charset tag to existing head if not present
      if (!headMatch[1].includes('charset')) {
        return html.replace(
          headMatch[0], 
          `<head${headMatch[0].substring(5, headMatch[0].indexOf('>'))}>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            ${headMatch[1]}
          </head>`
        );
      }
    } else if (html.includes('<html')) {
      // Add head with meta charset if no head exists
      return html.replace(
        /<html[^>]*>/i,
        `$&<head><meta charset="utf-8"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>`
      );
    }
  }
  
  return html;
}

// Remove tracking elements from content
function removeTrackingElements(content) {
  if (!content) return '';
  
  let cleanedContent = content;
  
  // 1. Remove all tracking image tags
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"]([^'"]+)['"][^>]*>/gi,
    (match, src) => {
      if (isTrackingUrl(src)) {
        return ''; // Remove tracking images
      }
      return match;
    }
  );
  
  // 2. Remove tracking links but preserve inner content
  cleanedContent = cleanedContent.replace(
    /<a[^>]*?href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi,
    (match, href, innerContent) => {
      if (isTrackingUrl(href)) {
        return innerContent;
      }
      return match;
    }
  );
  
  // 3. Remove all script tags
  cleanedContent = cleanedContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, 
    ''
  );
  
  // 4. Remove inline event handlers
  cleanedContent = cleanedContent.replace(
    /\s(on\w+)=['"]([^'"]*)['"]/gi,
    ''
  );
  
  // 5. Remove tracking pixels with long URLs
  cleanedContent = cleanedContent.replace(
    /<img[^>]*?src=['"][^'"]{150,}['"][^>]*>/gi,
    ''
  );
  
  // 6. Remove iframe content
  cleanedContent = cleanedContent.replace(
    /<iframe[^>]*>([\s\S]*?)<\/iframe>/gi, 
    ''
  );
  
  // 7. Remove meta refresh tags
  cleanedContent = cleanedContent.replace(
    /<meta[^>]*?http-equiv=['"]refresh['"][^>]*>/gi,
    ''
  );
  
  // 8. Remove problematic link tags
  cleanedContent = cleanedContent.replace(
    /<link[^>]*?href=['"]https?:\/\/(?:[^'"]+)\.(?:analytics|track|click|mail|open)[^'"]*['"][^>]*>/gi, 
    ''
  );
  
  // 9. Remove specific problematic domains
  const specificDomains = ['analytics.boozt.com', 'url2879.vitavenn.vita.no', 'vitavenn.vita.no'];
  cleanedContent = cleanedContent.replace(
    new RegExp(`<[^>]*?(?:src|href)=['"]https?://(?:[^'"]*?)(${specificDomains.join('|')})([^'"]*?)['"][^>]*>`, 'gi'),
    ''
  );
  
  // 10. Remove specific tracking patterns
  cleanedContent = cleanedContent.replace(
    /<[^>]*?(?:src|href)=['"][^'"]*?(?:JGZ2HocBug|wuGK4U8731)[^'"]*?['"][^>]*>/gi,
    ''
  );
  
  return cleanedContent;
}

// Check if URL is likely a tracking URL
function isTrackingUrl(url) {
  // List of common tracking domains and patterns
  const trackingDomains = [
    'analytics', 'track', 'click', 'open', 'mail', 'url', 'beacon', 'wf', 'ea', 'stat',
    'vitavenn', 'boozt', 'everestengagement', 'email.booztlet', 
    'wuGK4U8731', 'open.aspx', 'JGZ2HocBug'
  ];

  // Additional specific domains from error logs
  const specificTrackingDomains = [
    'analytics.boozt.com',
    'url2879.vitavenn.vita.no',
    'vitavenn.vita.no'
  ];

  // Common tracking URL patterns
  const trackingPatterns = [
    /\/open\.aspx/i,
    /\/wf\/open/i,
    /\/ea\/\w+/i,
    /[?&](utm_|trk|tracking|cid|eid|sid)/i,
    /\.gif(\?|$)/i,
    /pixel\.(gif|png|jpg)/i,
    /beacon\./i,
    /click\./i,
    /JGZ2HocBug/i,
    /wuGK4U8731/i
  ];
  
  // Check against known specific tracking domains first
  if (specificTrackingDomains.some(domain => url.includes(domain))) {
    return true;
  }
  
  // Check against known tracking domains
  if (trackingDomains.some(domain => url.includes(domain))) {
    return true;
  }
  
  // Check against known tracking patterns
  if (trackingPatterns.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Additional check for long query parameters
  if (url.includes('?') && url.length > 100 && /[?&].{30,}/.test(url)) {
    return true;
  }
  
  return false;
}

// Main function to fetch emails from Gmail
async function fetchGmailEmails(accessToken, refreshToken, accountId, supabase, verbose = false) {
  if (verbose) {
    console.log(`Fetching emails from Gmail API with token: ${accessToken ? accessToken.substring(0, 10) + '...' : 'NO TOKEN'}`);
    console.log(`Refresh token available: ${refreshToken ? 'Yes' : 'No'}`);
  }
  
  if (!accessToken) {
    console.error('No access token provided to fetchGmailEmails');
    throw new Error('Missing access token for Gmail API');
  }
  
  try {
    // First, get the user's profile information
    let currentToken = accessToken;
    let result = await makeGmailApiRequest('https://www.googleapis.com/gmail/v1/users/me/profile', currentToken);
    
    // Check if token needs refresh
    if (result.needsRefresh) {
      console.log('Access token expired, attempting to refresh...');
      if (!refreshToken) {
        throw new Error('Token expired and no refresh token available');
      }
      
      // Refresh the token
      currentToken = await refreshGoogleToken(refreshToken, accountId, supabase);
      
      // Retry the request with the new token
      result = await makeGmailApiRequest('https://www.googleapis.com/gmail/v1/users/me/profile', currentToken);
      
      if (result.needsRefresh) {
        throw new Error('Still getting 401 after token refresh. Authentication issue persists.');
      }
    }
    
    const userInfo = result.data;
    if (verbose) {
      console.log(`Fetching emails for Gmail user: ${userInfo.emailAddress}`);
    }
    
    // Get message list - limited to 50
    result = await makeGmailApiRequest(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=50', 
      currentToken
    );
    
    if (result.needsRefresh) {
      currentToken = await refreshGoogleToken(refreshToken, accountId, supabase);
      result = await makeGmailApiRequest(
        'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=50', 
        currentToken
      );
    }
    
    const messageList = result.data;
    
    if (!messageList.messages || messageList.messages.length === 0) {
      if (verbose) {
        console.log('No messages found in Gmail');
      }
      return [];
    }
    
    if (verbose) {
      console.log(`Found ${messageList.messages.length} messages, fetching details`);
    }
    
    // Fetch full message details (limited to 20 to avoid rate limits)
    const emails = [];
    
    for (const message of messageList.messages.slice(0, 20)) {
      // Fetch full message details
      result = await makeGmailApiRequest(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, 
        currentToken
      );
      
      if (result.needsRefresh) {
        currentToken = await refreshGoogleToken(refreshToken, accountId, supabase);
        result = await makeGmailApiRequest(
          `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, 
          currentToken
        );
      }
      
      const messageData = result.data;
      
      // Extract headers
      const headers = messageData.payload.headers.reduce((acc, header) => {
        acc[header.name.toLowerCase()] = header.value;
        return acc;
      }, {});
      
      // Extract content
      const { html, plainText } = extractEmailContent(messageData);
      
      // Create email object
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

// Function to save an email to the database
async function saveEmailToDatabase(email, accountId, supabase, verbose = false) {
  try {
    // Check if email already exists to avoid duplicates
    if (verbose) {
      console.log(`Checking if email ${email.id} already exists...`);
    }
    
    const { data: existingData } = await supabase
      .from('newsletters')
      .select('id')
      .eq('email_id', accountId)
      .eq('gmail_message_id', email.id)
      .maybeSingle();
    
    if (existingData) {
      if (verbose) {
        console.log(`Email ${email.id} already exists, skipping`);
      }
      return null;
    }
    
    // Prepare email data for saving
    const emailData = {
      email_id: accountId,
      gmail_message_id: email.id,
      gmail_thread_id: email.threadId,
      title: email.subject,
      sender_email: email.sender_email,
      sender: email.sender,
      content: email.html || email.snippet || '',
      published_at: email.date,
      preview: email.snippet || '',
    };
    
    if (verbose) {
      console.log(`Inserting email:`, {
        id: email.id,
        title: emailData.title,
        sender: emailData.sender
      });
    }
    
    // Pre-process content to remove tracking elements before saving
    if (emailData.content) {
      emailData.content = removeTrackingElements(emailData.content);
      if (verbose) {
        console.log('Tracking elements removed from email content before storage');
      }
    }
    
    // Insert email into database
    const { data, error } = await supabase
      .from('newsletters')
      .insert(emailData)
      .select()
      .single();
    
    if (error) {
      console.error(`Error saving email ${email.id}:`, error);
      throw error;
    }
    
    if (verbose) {
      console.log(`Saved email: ${data.title}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error processing email ${email.id}:`, error);
    throw error;
  }
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    const { accountId, debug = false, verbose = false, import_all_emails = true } = requestData;
    
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
      console.log(`Starting sync for account ${accountId} with debug=${debug}, verbose=${verbose}, import_all_emails=${import_all_emails}`);
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
      console.log(`Access token available: ${accountData.access_token ? 'Yes' : 'No'}`);
      console.log(`Refresh token available: ${accountData.refresh_token ? 'Yes' : 'No'}`);
      console.log(`Last token refresh: ${accountData.last_token_refresh || 'Never'}`);
    }
    
    // Check if the access token needs to be refreshed
    let accessToken = accountData.access_token;
    const refreshToken = accountData.refresh_token;
    
    if (!accessToken && refreshToken) {
      try {
        console.log(`No access token available for ${accountData.email}, attempting to refresh`);
        accessToken = await refreshGoogleToken(refreshToken, accountId, supabase);
        console.log('Successfully refreshed token');
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to refresh authentication: ${refreshError.message}`,
            details: { requiresReauthentication: true }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Update last_sync timestamp
    await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);
    
    // Fetch emails from the appropriate provider
    let emails = [];
    let errorFetchingEmails = null;
    
    try {
      if (accountData.provider === 'gmail') {
        // Use the access token to fetch emails from Gmail API
        emails = await fetchGmailEmails(
          accessToken, 
          refreshToken, 
          accountId, 
          supabase, 
          verbose
        );
        
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
      
      // Check if this is an authentication error
      const isAuthError = error.message.includes('authentication') || 
                          error.message.includes('credential') || 
                          error.message.includes('token') ||
                          error.message.includes('auth');
                          
      if (isAuthError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Authentication error: ${error.message}`,
            details: { requiresReauthentication: true }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
    
    // Process and save all emails
    const synced = [];
    const failed = [];
    const uniqueSenders = new Set();

    for (const email of emails) {
      try {
        const savedEmail = await saveEmailToDatabase(email, accountId, supabase, verbose);
        if (savedEmail) {
          synced.push(savedEmail);
          
          // Track unique senders
          if (email.sender_email) {
            uniqueSenders.add(email.sender_email);
          }
        }
      } catch (error) {
        console.error(`Error processing email ${email.id}:`, error);
        failed.push({
          id: email.id,
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
        warning: partial ? 'Some emails failed to sync' : null,
        details: {
          accountEmail: accountData.email,
          provider: accountData.provider,
          totalEmails: emails.length,
          syncedCount: synced.length,
          failedCount: failed.length,
          new_senders_count: uniqueSenders.size
        },
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
