
import { refreshGoogleToken } from './auth/googleToken.ts';
import { makeGmailApiRequest } from './gmail/apiRequest.ts';
import { extractEmailContent } from './gmail/contentExtractor.ts';

// Re-export the functions from the modules
export { refreshGoogleToken } from './auth/googleToken.ts';
export { makeGmailApiRequest } from './gmail/apiRequest.ts';
export { extractEmailContent } from './gmail/contentExtractor.ts';

/**
 * Main function to fetch emails from Gmail
 * @param accessToken The access token for Gmail API
 * @param refreshToken The refresh token for token refresh if needed
 * @param accountId The account ID
 * @param supabase The Supabase client instance
 * @param verbose Whether to log verbose information
 * @returns An array of email objects
 */
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
    
    // Get message list - increased to 25 from 20 for more content
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
    
    // Fetch full message details with increased limit (25 instead of 20)
    const emails = [];
    
    for (const message of messageList.messages.slice(0, 25)) {
      // Fetch full message details with FULL format to get all content
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
      
      if (verbose && html) {
        // Count images in the HTML to provide debugging info
        const imgTagCount = (html.match(/<img[^>]*>/gi) || []).length;
        console.log(`Email ${message.id} has ${imgTagCount} image tags in HTML content`);
      }
      
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
