
/**
 * Log account details for debugging
 */
export function logAccountDetails(accountData: any) {
  console.log(`Found account: ${accountData.email} (${accountData.provider || 'unknown provider'})`);
  console.log(`Access token available: ${accountData.access_token ? 'Yes' : 'No'}`);
  console.log(`Refresh token available: ${accountData.refresh_token ? 'Yes' : 'No'}`);
  console.log(`Last token refresh: ${accountData.last_token_refresh || 'Never'}`);
  console.log(`Last sync: ${accountData.last_sync || 'Never'}`);
}
