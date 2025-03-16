
import { decodeGmailContent, ensureProperHtmlStructure } from '../content.ts';

/**
 * Extracts email content from Gmail message parts
 * @param messageData The Gmail message data to process
 * @returns Object containing HTML and plain text content
 */
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
    } else if (part.mimeType?.startsWith('image/') && part.body?.attachmentId) {
      // Log found image attachments (these would require additional API calls to fetch)
      console.log(`Found image attachment with ID: ${part.body.attachmentId}`);
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
