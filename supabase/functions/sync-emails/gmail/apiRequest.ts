
/**
 * Makes a request to the Gmail API with the given token
 * @param url The Gmail API URL to request
 * @param token The access token to use
 * @returns The API response data or an indicator that token refresh is needed
 */
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
