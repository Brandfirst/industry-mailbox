
/**
 * Handles email account retrieval and validation
 * @param supabase The Supabase client instance
 * @param accountId The account ID to retrieve
 * @param verbose Whether to log detailed information
 * @returns Object containing success status and account data or error
 */
export async function handleEmailAccount(supabase: any, accountId: string, verbose: boolean) {
  if (!accountId) {
    return {
      success: false,
      error: 'No account ID provided'
    };
  }
  
  try {
    // Get email account
    const { data: accountData, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    
    if (accountError) {
      console.error('Error fetching email account:', accountError);
      
      // Check if this is a not found error
      if (accountError.code === 'PGRST116') {
        return {
          success: false,
          error: 'Email account not found',
          details: { code: 'NOT_FOUND', accountId }
        };
      }
      
      return {
        success: false,
        error: `Failed to fetch email account: ${accountError.message}`,
        details: accountError
      };
    }
    
    if (!accountData) {
      return {
        success: false,
        error: 'Email account not found or is empty',
        details: { accountId }
      };
    }
    
    if (verbose) {
      logAccountDetails(accountData);
    }
    
    // Check if we have token information
    if (!accountData.access_token) {
      return {
        success: false,
        error: 'Email account is missing authentication credentials',
        details: { 
          accountId,
          requiresReauthentication: true
        }
      };
    }
    
    return {
      success: true,
      accountData
    };
  } catch (error) {
    console.error('Unexpected error handling email account:', error);
    return {
      success: false,
      error: `Unexpected error handling email account: ${error.message || String(error)}`,
      details: { 
        stack: error.stack,
        accountId 
      }
    };
  }
}

/**
 * Log account details for debugging
 */
function logAccountDetails(accountData: any) {
  console.log(`Found account: ${accountData.email} (${accountData.provider || 'unknown provider'})`);
  console.log(`Access token available: ${accountData.access_token ? 'Yes' : 'No'}`);
  console.log(`Refresh token available: ${accountData.refresh_token ? 'Yes' : 'No'}`);
  console.log(`Last token refresh: ${accountData.last_token_refresh || 'Never'}`);
  console.log(`Last sync: ${accountData.last_sync || 'Never'}`);
}
