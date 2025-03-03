
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update({ 
        access_token,
        // Don't overwrite refresh_token as it's not always returned
        last_token_refresh: new Date().toISOString()
      })
      .eq('id', accountId);
      
    if (updateError) {
      console.error('Error updating access token in database:', updateError);
      throw new Error('Failed to save refreshed token');
    }
    
    console.log(`Successfully refreshed token for account ${accountId}. New token starts with: ${access_token.substring(0, 10)}...`);
    return access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error(`Token refresh failed: ${error.message}`);
  }
}

async function fetchGmailEmails(accessToken, refreshToken, accountId, supabase, verbose = false) {
  if (verbose) {
    console.log(`Fetching emails from Gmail API with token: ${accessToken ? accessToken.substring(0, 10) + '...' : 'NO TOKEN'}`);
    console.log(`Refresh token available: ${refreshToken ? 'Yes' : 'No'}`);
  }
  
  if (!accessToken) {
    console.error('No access token provided to fetchGmailEmails');
    throw new Error('Missing access token for Gmail API');
  }
  
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
  
  try {
    // First, let's get the user's email address
    let currentToken = accessToken;
    let result = await makeGmailApiRequest('https://www.googleapis.com/gmail/v1/users/me/profile', currentToken);
    
    // Check if token is invalid and needs refresh
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
    
    // Get list of message IDs - modified to get up to 50 messages
    result = await makeGmailApiRequest(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=50', 
      currentToken
    );
    
    if (result.needsRefresh) {
      // This shouldn't happen if we just refreshed, but handle it anyway
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
    
    // Fetch details for each message
    const emails = [];
    
    for (const message of messageList.messages.slice(0, 20)) { // Limit to 20 messages to avoid rate limits
      result = await makeGmailApiRequest(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, 
        currentToken
      );
      
      if (result.needsRefresh) {
        // This shouldn't happen if we just refreshed, but handle it anyway
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
    
    // Check if the access token needs to be refreshed based on time since last refresh
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
      
      // Check if this is an authentication error that might be fixed by re-authenticating
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
    
    // No filtering - process all emails
    if (verbose) {
      console.log(`Processing all ${emails.length} emails`);
    }
    
    // Process and save all emails
    const synced = [];
    const failed = [];
    
    for (const email of emails) {
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
          continue;
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
        
        // Insert email into database
        const { data, error } = await supabase
          .from('newsletters')
          .insert(emailData)
          .select()
          .single();
        
        if (error) {
          console.error(`Error saving email ${email.id}:`, error);
          failed.push({
            id: email.id,
            error: error.message
          });
        } else {
          if (verbose) {
            console.log(`Saved email: ${data.title}`);
          }
          synced.push(data);
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
        details: debug ? {
          accountEmail: accountData.email,
          provider: accountData.provider,
          totalEmails: emails.length,
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
