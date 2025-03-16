// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

serve(async (req) => {
  try {
    // Parse the request body or use empty object if it fails
    const reqData = req.body ? await req.json().catch(() => ({})) : {};
    
    // CORS headers for browser requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
    
    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }
    
    // Get required environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Extract parameters from the request
    const { 
      forceRun = false,
      accountId = null, 
      manual = false 
    } = reqData;
    
    // Log the invocation
    console.log(`Scheduled sync function invoked with forceRun=${forceRun}, accountId=${accountId}, manual=${manual}`);
    
    // If a specific account ID is provided, sync only that account
    if (accountId) {
      return await handleSingleAccountSync(supabase, accountId, forceRun, manual, corsHeaders);
    }
    
    // Otherwise, get all accounts with enabled sync
    const { data: accounts, error } = await supabase
      .from('email_accounts')
      .select('id, email, provider, sync_settings')
      .filter('is_connected', 'eq', true);
    
    if (error) {
      console.error('Error fetching accounts:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch accounts', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log(`Found ${accounts?.length || 0} connected accounts`);
    
    // No accounts found
    if (!accounts || accounts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No connected accounts found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process each account that has sync enabled
    const syncTasks = accounts
      .filter(account => {
        // Check if the account has sync settings and is enabled
        const settings = account.sync_settings;
        const enabled = settings?.enabled === true;
        const scheduleType = settings?.schedule_type || settings?.scheduleType || 'disabled';
        
        return enabled && scheduleType !== 'disabled';
      })
      .map(async (account) => {
        try {
          await syncAccount(supabase, account, forceRun);
          return { account: account.email, success: true };
        } catch (err) {
          console.error(`Error syncing account ${account.email}:`, err);
          return { account: account.email, success: false, error: err.message };
        }
      });
    
    // Wait for all sync tasks to complete
    const results = await Promise.all(syncTasks);
    
    // Return the results
    return new Response(
      JSON.stringify({ 
        message: 'Scheduled sync completed', 
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (err) {
    console.error('Unexpected error in scheduled-sync function:', err);
    
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: err.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

/**
 * Handle syncing a single account
 */
async function handleSingleAccountSync(supabase: any, accountId: string, forceRun: boolean, manual: boolean, corsHeaders: any) {
  try {
    // Fetch the account
    const { data: account, error } = await supabase
      .from('email_accounts')
      .select('id, email, provider, sync_settings')
      .eq('id', accountId)
      .single();
    
    if (error) {
      console.error(`Error fetching account ${accountId}:`, error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch account', details: error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!account) {
      return new Response(
        JSON.stringify({ error: 'Account not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Log about the account
    console.log(`Processing account: ${account.email} (${account.provider})`);
    
    // Check if the account should be synced
    if (!forceRun && !manual) {
      const settings = account.sync_settings;
      const enabled = settings?.enabled === true;
      const scheduleType = settings?.schedule_type || settings?.scheduleType || 'disabled';
      
      if (!enabled || scheduleType === 'disabled') {
        return new Response(
          JSON.stringify({ message: 'Sync is not enabled for this account' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Sync the account
    const result = await syncAccount(supabase, account, forceRun || manual);
    
    // Return the result
    return new Response(
      JSON.stringify({
        message: 'Scheduled sync completed',
        account: account.email,
        result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error(`Error handling single account sync for ${accountId}:`, err);
    return new Response(
      JSON.stringify({ error: 'Sync failed', details: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}

/**
 * Sync an individual account
 */
async function syncAccount(supabase: any, account: any, forceRun: boolean) {
  const { id, email, sync_settings } = account;
  console.log(`Syncing account: ${email}`);
  
  // Check for minute sync setting
  const scheduleType = sync_settings?.schedule_type || sync_settings?.scheduleType || 'disabled';
  const hourValue = sync_settings?.hour;
  
  // For hourly sync, check if the current minute is 0-5 to prevent multiple syncs
  if (scheduleType === 'hourly' && !forceRun) {
    const currentMinute = new Date().getMinutes();
    if (currentMinute > 5) {
      console.log(`Skipping hourly sync for ${email} because current minute (${currentMinute}) is > 5`);
      return { skipped: true, reason: 'Not within hourly sync window' };
    }
  }
  
  // For daily sync, check if the current hour matches the configured hour
  if (scheduleType === 'daily' && !forceRun) {
    const currentHour = new Date().getHours();
    if (hourValue !== undefined && hourValue !== null && currentHour !== hourValue) {
      console.log(`Skipping daily sync for ${email} because current hour (${currentHour}) does not match configured hour (${hourValue})`);
      return { skipped: true, reason: 'Not within daily sync window' };
    }
  }
  
  if (scheduleType === 'minute') {
    console.log(`Minute sync for account ${id} (${email}) - scheduled to run every minute`);
  } else if (scheduleType === 'hourly') {
    console.log(`Hourly sync for account ${id} (${email}) - scheduled to run at minute 0 of each hour`);
  } else if (scheduleType === 'daily') {
    console.log(`Daily sync for account ${id} (${email}) - scheduled to run at hour ${hourValue}:00`);
  }
  
  try {
    // First create a processing log entry
    const { data: logEntry } = await supabase.rpc('add_sync_log', {
      account_id_param: id,
      status_param: 'processing',
      message_count_param: 0,
      details_param: { schedule_type: scheduleType, hour: hourValue },
      sync_type_param: 'scheduled'
    });
    
    const logId = logEntry?.id;
    console.log(`Created processing log entry ${logId} for scheduled sync of account ${id}`);
    
    // Then call the sync-emails function with the scheduled flag
    const response = await supabase.functions.invoke('sync-emails', {
      body: {
        accountId: id,
        import_all_emails: true,
        scheduled: true,
        sync_log_id: logId, // Pass the log ID to update instead of creating new entries
        debug: true
      }
    });
    
    console.log(`Sync completed for ${email} with status:`, response.status);
    
    // Check if the request failed
    if (!response.data || response.error) {
      console.error(`Sync failed for ${email}:`, response.error || 'Unknown error');
      
      // The sync-emails function should update the log entry itself
      
      return {
        success: false,
        error: response.error || 'Unknown error',
        status: response.status
      };
    }
    
    // The sync-emails function should update the log entry itself
    
    // Return success
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error(`Exception in syncAccount for ${email}:`, error);
    
    // Try to update the log entry to failed
    try {
      await supabase.rpc('add_sync_log', {
        account_id_param: id,
        status_param: 'failed',
        message_count_param: 0,
        error_message_param: `Exception: ${error.message || String(error)}`,
        details_param: { schedule_type: scheduleType, hour: hourValue },
        sync_type_param: 'scheduled'
      });
    } catch (logError) {
      console.error(`Failed to create error log for ${email}:`, logError);
    }
    
    throw error;
  }
}
