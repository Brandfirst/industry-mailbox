
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create Supabase client with admin privileges
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    console.log('Starting scheduled sync check...');
    
    // Check if this is a manual trigger
    let isManualTrigger = false;
    let isForceRun = false;
    let manualAccountId = null;
    
    try {
      const requestData = await req.json();
      isManualTrigger = !!requestData.manual;
      isForceRun = !!requestData.forceRun;
      manualAccountId = requestData.accountId || null;
      console.log(`Request data: manual=${isManualTrigger}, forceRun=${isForceRun}, accountId=${manualAccountId || 'not specified'}`);
    } catch (e) {
      // No request body or invalid JSON, continue as normal scheduled run
      console.log('No request body or invalid JSON, proceeding as normal scheduled run');
    }
    
    // Get the current time
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    
    console.log(`Current time: ${now.toISOString()} (${currentHour}:${currentMinute} UTC)`);
    console.log(`Run type: ${isManualTrigger ? 'manual trigger' : 'scheduled'}`);
    
    // Get all email accounts with enabled sync settings
    // If a specific account was specified in manual mode, only get that one
    let accountsQuery = supabase
      .from('email_accounts')
      .select('id, email, provider, sync_settings')
      .not('sync_settings', 'is', null);
      
    if (isManualTrigger && manualAccountId) {
      accountsQuery = accountsQuery.eq('id', manualAccountId);
    }
    
    const { data: accounts, error: accountsError } = await accountsQuery;
      
    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching accounts', details: accountsError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    console.log(`Found ${accounts?.length || 0} accounts with sync settings`);
    
    // Track which accounts we'll sync
    const accountsToSync: string[] = [];
    
    // Check each account to see if it's due for a sync
    for (const account of accounts || []) {
      const settings = account.sync_settings as any;
      
      // Skip if sync is not enabled
      if (!settings?.enabled || settings?.scheduleType === 'disabled') {
        console.log(`Account ${account.id} (${account.email}) - sync disabled, skipping`);
        continue;
      }
      
      // If this is a force run or manual trigger for a specific account, sync regardless of schedule
      if (isForceRun || (isManualTrigger && manualAccountId === account.id)) {
        console.log(`Force run or manual trigger for account ${account.id} (${account.email})`);
        accountsToSync.push(account.id);
        
        // Create a processing log entry for this manual sync
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: account.id,
            status_param: 'processing',
            message_count_param: 0,
            error_message_param: null,
            details_param: { 
              attempt_time: now.toISOString(),
              manual_trigger: true,
              force_run: isForceRun
            },
            sync_type_param: isManualTrigger ? 'manual' : 'scheduled'
          });
          console.log(`Created processing log entry for account ${account.id} (manual/force trigger)`);
        } catch (logError) {
          console.error(`Error creating log entry for account ${account.id}:`, logError);
        }
        
        continue;
      }
      
      // Check if we should sync based on schedule type
      let shouldSync = false;
      
      switch (settings.scheduleType) {
        case 'minute':
          // For minute schedule, always run when the scheduled function is called
          shouldSync = true;
          console.log(`Minute sync for account ${account.id} (${account.email}) - scheduled to run every minute`);
          break;
        case 'hourly':
          // Sync at the top of each hour
          shouldSync = currentMinute === 0;
          console.log(`Hourly sync for account ${account.id} - should sync: ${shouldSync} (minute: ${currentMinute})`);
          break;
        case 'daily':
          // Sync once per day at specified hour
          const hourToSync = typeof settings.hour === 'number' ? settings.hour : 0;
          shouldSync = currentHour === hourToSync && currentMinute === 0;
          console.log(`Daily sync for account ${account.id} - should sync: ${shouldSync} (hour: ${currentHour}, target: ${hourToSync}, minute: ${currentMinute})`);
          break;
      }
      
      // Queue this account for syncing if it's time
      if (shouldSync) {
        console.log(`Scheduling sync for account ${account.id} (${account.email}), scheduleType: ${settings.scheduleType}`);
        accountsToSync.push(account.id);
        
        // Log the scheduled sync attempt with explicit sync_type
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: account.id,
            status_param: 'processing',
            message_count_param: 0,
            error_message_param: null,
            details_param: { attempt_time: now.toISOString() },
            sync_type_param: 'scheduled'
          });
          console.log(`Created processing log entry for account ${account.id}`);
        } catch (logError) {
          console.error(`Error creating log entry for account ${account.id}:`, logError);
        }
      }
    }
    
    // Trigger sync for each account that needs it
    const syncResults = [];
    
    for (const accountId of accountsToSync) {
      try {
        console.log(`Triggering sync for account ${accountId}`);
        
        // Call the sync-emails function for this account
        const syncResponse = await supabase.functions.invoke('sync-emails', {
          body: { 
            accountId,
            scheduled: true,
            debug: true
          }
        });
        
        console.log(`Sync result for ${accountId}:`, syncResponse);
        
        // Check if the sync was successful
        if (syncResponse.error) {
          console.error(`Error in sync response for ${accountId}:`, syncResponse.error);
          
          // Update the log with the failure
          try {
            await supabase.rpc('add_sync_log', {
              account_id_param: accountId,
              status_param: 'failed',
              message_count_param: 0,
              error_message_param: `Sync failed: ${syncResponse.error}`,
              details_param: null,
              sync_type_param: isManualTrigger ? 'manual' : 'scheduled'
            });
          } catch (logError) {
            console.error(`Error updating log for account ${accountId}:`, logError);
          }
          
          syncResults.push({ 
            accountId, 
            success: false, 
            error: syncResponse.error 
          });
        } else {
          // The sync-emails function already handles log creation for success cases
          syncResults.push({ 
            accountId, 
            success: true, 
            data: syncResponse.data 
          });
        }
      } catch (error) {
        console.error(`Error syncing account ${accountId}:`, error);
        
        // Create failure log entry if the sync function call failed
        try {
          await supabase.rpc('add_sync_log', {
            account_id_param: accountId,
            status_param: 'failed',
            message_count_param: 0,
            error_message_param: `Failed to invoke sync function: ${error.message || String(error)}`,
            details_param: null,
            sync_type_param: isManualTrigger ? 'manual' : 'scheduled'
          });
        } catch (logError) {
          console.error(`Error creating failure log for account ${accountId}:`, logError);
        }
        
        syncResults.push({ 
          accountId, 
          success: false, 
          error 
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Scheduled sync check completed',
        results: syncResults,
        accounts_synced: accountsToSync.length,
        timestamp: now.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error in scheduled sync:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
