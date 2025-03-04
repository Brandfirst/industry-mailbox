
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

/**
 * Refreshes a Google OAuth token using the provided refresh token
 * @param refresh_token The refresh token to use
 * @param accountId The account ID for logging
 * @param supabase The Supabase client instance
 * @returns A new access token
 */
export async function refreshGoogleToken(refresh_token, accountId, supabase) {
  if (!refresh_token) {
    console.error('No refresh token available for account', accountId);
    throw new Error('No refresh token available to refresh access');
  }

  try {
    console.log(`Attempting to refresh token for account ${accountId} with refresh token: ${refresh_token.substring(0, 10)}...`);
    
    // Get Google client credentials from env
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      throw new Error('Google credentials not configured: ' + (!clientId ? 'Missing client ID' : 'Missing client secret'));
    }
    
    // Exchange refresh token for a new access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Error refreshing Google token, HTTP status:', tokenResponse.status, 'Response:', errorText);
      try {
        const tokenData = JSON.parse(errorText);
        throw new Error(`Failed to refresh token: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
      } catch (parseError) {
        throw new Error(`Failed to refresh token: HTTP ${tokenResponse.status} - ${errorText || 'No response details'}`);
      }
    }
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('No access token in refresh response:', tokenData);
      throw new Error('No access token in refresh response');
    }
    
    const { access_token, expires_in } = tokenData;
    
    // Update the account with the new access token
    const updatePayload = { 
      access_token,
      last_token_refresh: new Date().toISOString()
    };
    
    console.log(`Updating token for account ${accountId}. Token updated payload prepared.`);
    
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update(updatePayload)
      .eq('id', accountId);
      
    if (updateError) {
      console.error('Error updating access token in database:', updateError);
      throw new Error(`Failed to save refreshed token: ${updateError.message}`);
    }
    
    console.log(`Successfully refreshed token for account ${accountId}. New token starts with: ${access_token.substring(0, 10)}...`);
    return access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw new Error(`Token refresh failed: ${error.message}`);
  }
}
