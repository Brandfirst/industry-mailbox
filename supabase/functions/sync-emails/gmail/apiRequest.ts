
/**
 * Makes a request to the Gmail API with the given token
 * @param url The Gmail API URL to request
 * @param token The access token to use
 * @returns The API response data or an indicator that token refresh is needed
 */
export async function makeGmailApiRequest(url: string, token: string) {
  try {
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
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
        console.error(`Gmail API error (${url}):`, errorData);
      } catch (parseError) {
        console.error(`Gmail API error (${url}): Could not parse error response`);
      }
      
      throw new Error(`Gmail API error: ${errorMessage}`);
    }
    
    return { data: await response.json(), needsRefresh: false };
  } catch (error) {
    // Enhance error with more context for debugging
    console.error(`Error in Gmail API request to ${url}:`, error);
    const enhancedError = new Error(
      `Gmail API request failed: ${error.message || String(error)}`
    );
    throw enhancedError;
  }
}
