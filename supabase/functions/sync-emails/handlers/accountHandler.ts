
/**
 * Handles email account retrieval and validation
 */
export async function handleEmailAccount(supabase: any, accountId: string, verbose: boolean) {
  // Get email account
  const { data: accountData, error: accountError } = await supabase
    .from('email_accounts')
    .select('*')
    .eq('id', accountId)
    .single();
  
  if (accountError) {
    console.error('Error fetching email account:', accountError);
    return {
      success: false,
      error: 'Email account not found'
    };
  }
  
  if (verbose) {
    logAccountDetails(accountData);
  }
  
  return {
    success: true,
    accountData
  };
}

/**
 * Log account details for debugging
 */
function logAccountDetails(accountData: any) {
  console.log(`Found account: ${accountData.email} (${accountData.provider})`);
  console.log(`Access token available: ${accountData.access_token ? 'Yes' : 'No'}`);
  console.log(`Refresh token available: ${accountData.refresh_token ? 'Yes' : 'No'}`);
  console.log(`Last token refresh: ${accountData.last_token_refresh || 'Never'}`);
}
