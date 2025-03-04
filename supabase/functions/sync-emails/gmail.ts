
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

// Module for handling token authentication and refresh
export async function refreshGoogleToken(refresh_token, accountId, supabase) {
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
export async function makeGmailApiRequest(url, token) {
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

// Main function to fetch emails from Gmail
export async function fetchGmailEmails(accessToken, refreshToken, accountId, supabase, verbose = false) {
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

// Extract email content from Gmail message parts
export function extractEmailContent(messageData) {
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

// Function to decode Gmail API content data
export function decodeGmailContent(rawData) {
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
