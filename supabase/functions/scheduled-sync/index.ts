
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
    
    // Get the current time
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();
    
    console.log(`Current time: ${now.toISOString()} (${currentHour}:${currentMinute} UTC)`);
    
    // Get all email accounts with enabled sync settings
    const { data: accounts, error: accountsError } = await supabase
      .from('email_accounts')
      .select('id, email, provider, sync_settings')
      .not('sync_settings', 'is', null);
      
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
        continue;
      }
      
      // Check if we should sync based on schedule type
      let shouldSync = false;
      
      switch (settings.scheduleType) {
        case 'minute':
          // Sync every minute
          shouldSync = true;
          break;
        case 'hourly':
          // Sync at the top of each hour
          shouldSync = currentMinute === 0;
          break;
        case 'daily':
          // Sync once per day at specified hour
          const hourToSync = typeof settings.hour === 'number' ? settings.hour : 0;
          shouldSync = currentHour === hourToSync && currentMinute === 0;
          break;
      }
      
      // Queue this account for syncing if it's time
      if (shouldSync) {
        console.log(`Scheduling sync for account ${account.id} (${account.email})`);
        accountsToSync.push(account.id);
        
        // Log the scheduled sync attempt
        await supabase.rpc('add_sync_log', {
          account_id_param: account.id,
          status_param: 'processing',
          message_count_param: 0,
          details_param: { attempt_time: now.toISOString() },
          sync_type_param: 'scheduled'
        });
      }
    }
    
    // Trigger sync for each account that needs it
    const syncPromises = accountsToSync.map(async (accountId) => {
      try {
        // Call the sync-emails function for this account
        const syncResponse = await supabase.functions.invoke('sync-emails', {
          body: { 
            accountId,
            scheduled: true,
            debug: true
          }
        });
        
        console.log(`Sync result for ${accountId}:`, syncResponse);
        return { accountId, success: true, response: syncResponse };
      } catch (error) {
        console.error(`Error syncing account ${accountId}:`, error);
        return { accountId, success: false, error };
      }
    });
    
    // Wait for all syncs to complete
    const results = await Promise.all(syncPromises);
    
    return new Response(
      JSON.stringify({ 
        message: 'Scheduled sync check completed',
        results,
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
