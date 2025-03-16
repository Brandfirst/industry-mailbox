
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

type Account = {
  id: string;
  email: string;
  sync_settings: {
    enabled: boolean;
    scheduleType: string;
    hour?: number;
  };
};

serve(async (req) => {
  // Set default headers
  const headers = {
    ...corsHeaders,
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Scheduled sync check running...");

    // Get current time
    const now = new Date();
    const currentHour = now.getUTCHours();
    const currentMinute = now.getUTCMinutes();

    // Get all email accounts with sync settings
    const { data: accounts, error } = await supabase
      .from('email_accounts')
      .select('id, email, sync_settings')
      .not('sync_settings', 'is', null);

    if (error) {
      console.error("Error fetching accounts:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch accounts" }),
        { status: 500, headers }
      );
    }

    console.log(`Found ${accounts.length} accounts with sync settings`);
    
    // Track accounts that were processed
    const processed = [];
    const skipped = [];
    const errors = [];

    // Process each account
    for (const account of accounts) {
      try {
        // Extract sync settings - handle both camelCase and snake_case keys for compatibility
        const settings = account.sync_settings;
        const enabled = settings.enabled === true;
        const scheduleType = settings.scheduleType || settings.schedule_type;
        const hour = typeof settings.hour === 'number' ? settings.hour : undefined;

        console.log(`Account ${account.id} (${account.email}): enabled=${enabled}, scheduleType=${scheduleType}, hour=${hour}`);

        // Skip if sync is disabled
        if (!enabled || scheduleType === 'disabled') {
          skipped.push({ id: account.id, reason: 'Sync disabled' });
          continue;
        }

        // Check if this account should sync based on schedule
        let shouldSync = false;

        switch (scheduleType) {
          case 'minute':
            // Sync every minute
            shouldSync = true;
            break;
          case 'hourly':
            // Sync once per hour, at the top of the hour
            shouldSync = currentMinute === 0;
            break;
          case 'daily':
            // Sync once per day, at the specified hour (or default to midnight)
            const syncHour = hour !== undefined ? hour : 0;
            shouldSync = currentHour === syncHour && currentMinute === 0;
            break;
        }

        if (!shouldSync) {
          skipped.push({ id: account.id, reason: 'Not scheduled for current time' });
          continue;
        }

        // Log the sync attempt
        await supabase.rpc('add_sync_log', {
          account_id_param: account.id,
          status_param: 'processing',
          message_count_param: 0,
          error_message_param: null,
          details_param: { schedule_type: scheduleType, scheduled_time: now.toISOString() },
          sync_type_param: 'scheduled'
        });

        // Call the sync-emails function
        const syncUrl = `${supabaseUrl}/functions/v1/sync-emails`;
        const response = await fetch(syncUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            accountId: account.id,
            scheduled: true
          })
        });

        const result = await response.json();
        
        // Update sync outcome based on response
        if (response.ok && result.success) {
          processed.push({
            id: account.id,
            result: {
              success: true,
              count: result.data?.count || 0
            }
          });
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (error) {
        console.error(`Error processing account ${account.id}:`, error);
        
        // Log the sync failure
        await supabase.rpc('add_sync_log', {
          account_id_param: account.id,
          status_param: 'failed',
          message_count_param: 0,
          error_message_param: `Scheduled sync failed: ${error.message || String(error)}`,
          details_param: null,
          sync_type_param: 'scheduled'
        });
        
        errors.push({
          id: account.id,
          error: error.message || String(error)
        });
      }
    }

    // Return summary of processed accounts
    return new Response(
      JSON.stringify({
        timestamp: now.toISOString(),
        processed,
        skipped,
        errors,
        summary: {
          total: accounts.length,
          processed: processed.length,
          skipped: skipped.length,
          errors: errors.length
        }
      }),
      { headers }
    );
  } catch (error) {
    console.error("Error in scheduled sync function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers }
    );
  }
});
