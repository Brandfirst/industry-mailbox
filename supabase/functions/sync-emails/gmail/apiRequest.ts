
/**
 * Makes a request to the Gmail API with the given token
 * @param url The Gmail API URL to request
 * @param token The access token to use
 * @returns The API response data or an indicator that token refresh is needed
 */
export async function makeGmailApiRequest(url: string, token: string) {
  // Add retry logic
  const maxRetries = 2;
  let retryCount = 0;
  let lastError = null;
  
  while (retryCount <= maxRetries) {
    try {
      // Add some delay between retries
      if (retryCount > 0) {
        console.log(`Retrying Gmail API request (attempt ${retryCount} of ${maxRetries})`);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 300));
      }
      
      // Configure fetch with timeout and more resilient settings
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'User-Agent': 'NewsletterSyncApp/1.0'
        },
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (response.status === 401) {
        // Return a special object indicating we need to refresh the token
        return { needsRefresh: true, response };
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
          console.error(`Gmail API error (${url}):`, errorData);
        } catch (parseError) {
          console.error(`Gmail API error (${url}): Could not parse error response`);
        }
        
        // For certain status codes, we should retry
        if ([429, 500, 502, 503, 504].includes(response.status)) {
          lastError = new Error(`Gmail API temporary error: ${errorMessage}`);
          retryCount++;
          continue; // Retry the request
        }
        
        throw new Error(`Gmail API error: ${errorMessage}`);
      }
      
      // Parse the response body
      try {
        const data = await response.json();
        return { data, needsRefresh: false };
      } catch (parseError) {
        console.error(`Error parsing Gmail API response from ${url}:`, parseError);
        throw new Error(`Failed to parse Gmail API response: ${parseError.message}`);
      }
    } catch (error) {
      // If this is an AbortError (timeout), we can retry
      if (error.name === 'AbortError') {
        console.error(`Gmail API request to ${url} timed out`);
        lastError = new Error(`Request timed out`);
        retryCount++;
        
        if (retryCount > maxRetries) {
          throw new Error(`Gmail API request timed out after ${maxRetries} retries`);
        }
        continue; // Retry the request
      }
      
      // For network errors, we can also retry
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        console.error(`Network error in Gmail API request to ${url}:`, error);
        lastError = error;
        retryCount++;
        
        if (retryCount > maxRetries) {
          // Enhance error with more context for debugging
          const enhancedError = new Error(
            `Gmail API network request failed after ${maxRetries} retries: ${error.message || String(error)}`
          );
          throw enhancedError;
        }
        continue; // Retry the request
      }
      
      // For other errors, just throw
      console.error(`Error in Gmail API request to ${url}:`, error);
      const enhancedError = new Error(
        `Gmail API request failed: ${error.message || String(error)}`
      );
      throw enhancedError;
    }
  }
  
  // If we've exhausted all retries
  throw lastError || new Error(`Gmail API request failed after ${maxRetries} retries`);
}
