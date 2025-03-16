
/**
 * Functions for updating account information
 */

/**
 * Update last_sync timestamp for an account
 */
export async function updateLastSyncTimestamp(
  supabase: any,
  accountId: string
) {
  await supabase
    .from('email_accounts')
    .update({ last_sync: new Date().toISOString() })
    .eq('id', accountId);
    
  console.log(`Updated last_sync timestamp for account ${accountId}`);
}
