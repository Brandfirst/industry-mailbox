
import { corsHeaders } from '../../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { fetchGmailEmails } from '../gmail.ts';
import { saveEmailToDatabase } from '../database.ts';
import { SyncRequestData, SyncResponseData } from '../types.ts';

/**
 * Main handler for sync email requests
 */
export async function handleSyncRequest(req: Request): Promise<Response> {
  try {
    // Parse request body
    const requestData = await req.json() as SyncRequestData;
    const { accountId, debug = false, verbose = false, import_all_emails = true } = requestData;
    
    if (!accountId) {
      console.error('No accountId provided');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No account ID provided' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (verbose) {
      console.log(`Starting sync for account ${accountId} with debug=${debug}, verbose=${verbose}, import_all_emails=${import_all_emails}`);
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get email account
    const { data: accountData, error: accountError } = await getEmailAccount(supabase, accountId);
    
    if (accountError) {
      console.error('Error fetching email account:', accountError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email account not found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (verbose) {
      logAccountDetails(accountData);
    }
    
    // Update last_sync timestamp
    await updateLastSyncTimestamp(supabase, accountId);
    
    // Handle token refresh and email fetching
    const result = await fetchAndProcessEmails(supabase, accountData, accountId, verbose);
    
    if (!result.success) {
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process and save emails
    const { synced, failed, uniqueSenders } = await processEmails(
      result.emails, 
      accountId, 
      supabase, 
      verbose
    );
    
    // Determine partial success
    const partial = failed.length > 0 && synced.length > 0;
    
    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        partial,
        count: synced.length,
        synced,
        failed: failed.length > 0 ? failed : [],
        warning: partial ? 'Some emails failed to sync' : null,
        details: {
          accountEmail: accountData.email,
          provider: accountData.provider,
          totalEmails: result.emails.length,
          syncedCount: synced.length,
          failedCount: failed.length,
          new_senders_count: uniqueSenders.size
        },
        debugInfo: debug ? {
          timestamp: new Date().toISOString(),
          accountId,
          emailsProcessed: result.emails.length,
          mock: false
        } : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error in sync-emails function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unexpected error: ${error.message}`,
        details: { stack: error.stack }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Fetch email account details
 */
async function getEmailAccount(supabase: any, accountId: string) {
  return await supabase
    .from('email_accounts')
    .select('*')
    .eq('id', accountId)
    .single();
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

/**
 * Update last_sync timestamp
 */
async function updateLastSyncTimestamp(supabase: any, accountId: string) {
  return await supabase
    .from('email_accounts')
    .update({ last_sync: new Date().toISOString() })
    .eq('id', accountId);
}

/**
 * Fetch and process emails from the provider
 */
async function fetchAndProcessEmails(supabase: any, accountData: any, accountId: string, verbose: boolean) {
  try {
    if (accountData.provider === 'gmail') {
      // Use the access token to fetch emails from Gmail API
      const emails = await fetchGmailEmails(
        accountData.access_token, 
        accountData.refresh_token, 
        accountId, 
        supabase, 
        verbose
      );
      
      if (verbose) {
        console.log(`Fetched ${emails.length} emails from Gmail API for ${accountData.email}`);
      }
      
      return { success: true, emails };
    } else {
      return { 
        success: false, 
        error: `Provider ${accountData.provider} is not supported` 
      };
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
    
    // Check if this is an authentication error
    const isAuthError = error.message.includes('authentication') || 
                        error.message.includes('credential') || 
                        error.message.includes('token') ||
                        error.message.includes('auth');
                        
    if (isAuthError) {
      return {
        success: false,
        error: `Authentication error: ${error.message}`,
        details: { requiresReauthentication: true }
      };
    }
    
    return {
      success: false,
      error: `Failed to retrieve emails: ${error.message}`
    };
  }
}

/**
 * Process and save emails to database
 */
async function processEmails(emails: any[], accountId: string, supabase: any, verbose: boolean) {
  const synced: any[] = [];
  const failed: any[] = [];
  const uniqueSenders = new Set<string>();

  for (const email of emails) {
    try {
      const savedEmail = await saveEmailToDatabase(email, accountId, supabase, verbose);
      if (savedEmail) {
        synced.push(savedEmail);
        
        // Track unique senders
        if (email.sender_email) {
          uniqueSenders.add(email.sender_email);
        }
      }
    } catch (error) {
      console.error(`Error processing email ${email.id}:`, error);
      failed.push({
        id: email.id,
        error: error.message
      });
    }
  }
  
  return { synced, failed, uniqueSenders };
}
