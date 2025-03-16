
import { logAccountDetails } from './accountLogger.ts';

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
    
    // Check if the token might be expired based on last refresh
    const lastTokenRefresh = new Date(accountData.last_token_refresh || 0);
    const tokenAgeInHours = (Date.now() - lastTokenRefresh.getTime()) / (1000 * 60 * 60);
    
    if (tokenAgeInHours > 23) { // Tokens typically last 1 hour, be conservative
      if (verbose) {
        console.log(`Token may be expired (last refresh: ${tokenAgeInHours.toFixed(2)} hours ago)`);
      }
      
      // If we have a refresh token, we can try to use it later
      if (!accountData.refresh_token) {
        return {
          success: false,
          error: 'Access token is likely expired and no refresh token is available',
          details: { 
            accountId,
            requiresReauthentication: true,
            tokenAge: `${tokenAgeInHours.toFixed(2)} hours`
          }
        };
      }
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
