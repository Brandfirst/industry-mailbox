// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts';
import { fetchGmailEmails, refreshGoogleToken } from './gmail.ts';
import { saveEmailToDatabase } from './database.ts';

// Main request handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
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
    
    // Get email account details
    const { data: accountData, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    
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
      console.log(`Found account: ${accountData.email} (${accountData.provider})`);
      console.log(`Access token available: ${accountData.access_token ? 'Yes' : 'No'}`);
      console.log(`Refresh token available: ${accountData.refresh_token ? 'Yes' : 'No'}`);
      console.log(`Last token refresh: ${accountData.last_token_refresh || 'Never'}`);
    }
    
    // Check if the access token needs to be refreshed
    let accessToken = accountData.access_token;
    const refreshToken = accountData.refresh_token;
    
    if (!accessToken && refreshToken) {
      try {
        console.log(`No access token available for ${accountData.email}, attempting to refresh`);
        accessToken = await refreshGoogleToken(refreshToken, accountId, supabase);
        console.log('Successfully refreshed token');
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to refresh authentication: ${refreshError.message}`,
            details: { requiresReauthentication: true }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // Update last_sync timestamp
    await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);
    
    // Fetch emails from the appropriate provider
    let emails = [];
    let errorFetchingEmails = null;
    
    try {
      if (accountData.provider === 'gmail') {
        // Use the access token to fetch emails from Gmail API
        emails = await fetchGmailEmails(
          accessToken, 
          refreshToken, 
          accountId, 
          supabase, 
          verbose
        );
        
        if (verbose) {
          console.log(`Fetched ${emails.length} emails from Gmail API for ${accountData.email}`);
        }
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Provider ${accountData.provider} is not supported` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      errorFetchingEmails = error.message;
      
      // Check if this is an authentication error
      const isAuthError = error.message.includes('authentication') || 
                          error.message.includes('credential') || 
                          error.message.includes('token') ||
                          error.message.includes('auth');
                          
      if (isAuthError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Authentication error: ${error.message}`,
            details: { requiresReauthentication: true }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (errorFetchingEmails) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to retrieve emails: ${errorFetchingEmails}`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process and save all emails
    const synced = [];
    const failed = [];
    const uniqueSenders = new Set();

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
          totalEmails: emails.length,
          syncedCount: synced.length,
          failedCount: failed.length,
          new_senders_count: uniqueSenders.size
        },
        debugInfo: debug ? {
          timestamp: new Date().toISOString(),
          accountId,
          emailsProcessed: emails.length,
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
})
