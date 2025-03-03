
/**
 * Text encoding utilities for handling special characters
 * Focuses on ensuring proper UTF-8 encoding for international content
 */
import { debugLog } from './debugUtils';

/**
 * Ensures that a string is properly UTF-8 encoded
 * Particularly useful for Nordic characters like ØÆÅøæå
 */
export const ensureUtf8Encoding = (text: string | null): string => {
  if (!text) return '';
  
  // Convert to string if it's not already
  let content = String(text);
  
  try {
    // Check for double-encoded UTF-8 sequences - these are common when data is 
    // double-encoded or when Latin-1 is interpreted as UTF-8
    if (content.includes('Ã¸') || content.includes('Ã¦') || content.includes('Ã…') || 
        content.includes('Ã˜') || content.includes('Ã†') || content.includes('Ã¥')) {
      debugLog('Detected possible double-encoded UTF-8, attempting to fix...');
      
      // Replace all known problematic sequences directly
      content = content
        // Fix for ø (small o with stroke)
        .replace(/Ã¸/g, 'ø')
        // Fix for æ (small ae)
        .replace(/Ã¦/g, 'æ')
        // Fix for å (small a with ring)
        .replace(/Ã¥/g, 'å')
        // Fix for Ø (capital O with stroke)
        .replace(/Ã˜/g, 'Ø')
        // Fix for Æ (capital AE)
        .replace(/Ã†/g, 'Æ')
        // Fix for Å (capital A with ring)
        .replace(/Ã…/g, 'Å');
      
      // If we still don't detect Nordic characters after direct replacement,
      // try a more aggressive approach with TextDecoder
      if (!/[ØÆÅøæå]/.test(content)) {
        try {
          // Try decoding as ISO-8859-1, which often works for Nordic characters
          const decoder = new TextDecoder('iso-8859-1');
          const encoder = new TextEncoder();
          const bytes = encoder.encode(content);
          content = decoder.decode(bytes);
          
          debugLog('After ISO-8859-1 decoding attempt:', content.substring(0, 100));
        } catch (e) {
          console.error('Error using TextDecoder with ISO-8859-1:', e);
        }
      }
    }
    
    // Additional manual replacements for common encoding issues with Nordic chars
    // Sometimes they appear with HTML entities or in other forms
    content = content
      // HTML entities for Nordic characters
      .replace(/&oslash;/g, 'ø')
      .replace(/&aelig;/g, 'æ')
      .replace(/&aring;/g, 'å')
      .replace(/&Oslash;/g, 'Ø')
      .replace(/&AElig;/g, 'Æ')
      .replace(/&Aring;/g, 'Å')
      // Numeric HTML entities
      .replace(/&#248;/g, 'ø')
      .replace(/&#230;/g, 'æ')
      .replace(/&#229;/g, 'å')
      .replace(/&#216;/g, 'Ø')
      .replace(/&#198;/g, 'Æ')
      .replace(/&#197;/g, 'Å');
    
    // Check for any remaining encoding anomalies and log them
    const doubleEncodedPattern = /Ã[…†˜¦ø¸]/g;
    const remainingDoubleEncoded = content.match(doubleEncodedPattern);
    if (remainingDoubleEncoded && remainingDoubleEncoded.length > 0) {
      debugLog('Remaining potentially double-encoded sequences:', 
                  [...new Set(remainingDoubleEncoded)].join(', '));
    }
    
    // Check if we found any Nordic characters after fixing
    const nordicChars = (content.match(/[ØÆÅøæå]/g) || []).join('');
    debugLog('NORDIC CHARACTERS AFTER UTF-8 NORMALIZATION:', nordicChars || 'None found');
    
    return content;
  } catch (error) {
    console.error('Error ensuring UTF-8 encoding:', error);
    return content; // Return original if encoding fails
  }
};
