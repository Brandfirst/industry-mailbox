import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Hello from connect-gmail!");

export interface EmailAccount {
  id: string;
  user_id: string;
  email: string;
  provider: string;
  is_connected: boolean;
  access_token: string;
  refresh_token: string | null;
  created_at: string | null;
  last_sync: string | null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Add CORS headers to all responses
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  try {
    // Get the auth code and user ID from the request body
    const { code, userId, redirectUri } = await req.json();
    
    // Log request parameters
    console.log(`Starting connect-gmail with: code length=${code?.length || 0}, userId=${userId}, redirectUri=${redirectUri}`);
    
    if (!code || !userId) {
      console.error("Missing required parameters: code or userId");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters" 
        }),
        { status: 400, headers }
      );
    }

    // Get required environment variables
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    
    // Use provided redirect URI or fall back to the one in environment
    const finalRedirectUri = redirectUri || Deno.env.get('GOOGLE_REDIRECT_URL');
    
    console.log(`Using OAuth parameters: clientId=${clientId ? 'exists' : 'missing'}, clientSecret=${clientSecret ? 'exists' : 'missing'}, redirectUri=${finalRedirectUri}`);
    
    if (!clientId || !clientSecret || !finalRedirectUri) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing Google OAuth configuration" 
        }),
        { status: 500, headers }
      );
    }

    // Exchange the authorization code for tokens
    console.log("Exchanging authorization code for tokens...");
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: finalRedirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    // Check for errors in the token exchange
    if (!tokenResponse.ok) {
      console.error("Error exchanging code for tokens:", tokenData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to exchange authorization code", 
          googleError: tokenData.error,
          googleErrorDescription: tokenData.error_description
        }),
        { status: 400, headers }
      );
    }

    // Get the access token, refresh token, and id token
    const { access_token, refresh_token, id_token } = tokenData;
    
    console.log("Successfully obtained tokens");
    
    // Get the user's email from Google
    console.log("Fetching user info from Google...");
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("Error getting user info:", userInfo);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to get user information from Google" 
        }),
        { status: 400, headers }
      );
    }

    const userEmail = userInfo.email;
    console.log(`Retrieved user email: ${userEmail}`);
    
    // Create a Supabase client (for admin operations)
    const supabaseAdminUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAdminKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    // Import Supabase JS client
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.37.0');
    const supabase = createClient(supabaseAdminUrl, supabaseAdminKey);

    // Check if this email account is already connected
    console.log("Checking if email is already connected...");
    const { data: existingAccounts, error: checkError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('email', userEmail);
      
    if (checkError) {
      console.error("Error checking existing accounts:", checkError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to check existing accounts" 
        }),
        { status: 500, headers }
      );
    }
    
    // If the account already exists, update it
    if (existingAccounts && existingAccounts.length > 0) {
      console.log("Updating existing email account connection...");
      const accountId = existingAccounts[0].id;
      
      const { data: updatedAccount, error: updateError } = await supabase
        .from('email_accounts')
        .update({
          access_token,
          refresh_token: refresh_token || null,
          is_connected: true,
        })
        .eq('id', accountId)
        .select()
        .single();
        
      if (updateError) {
        console.error("Error updating email account:", updateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to update email account" 
          }),
          { status: 500, headers }
        );
      }
      
      console.log("Successfully updated email account connection");
      return new Response(
        JSON.stringify({ 
          success: true, 
          account: updatedAccount 
        }),
        { status: 200, headers }
      );
    }
    
    // Otherwise, create a new account connection
    console.log("Creating new email account connection...");
    const { data: newAccount, error: createError } = await supabase
      .from('email_accounts')
      .insert({
        user_id: userId,
        email: userEmail,
        provider: 'google',
        is_connected: true,
        access_token,
        refresh_token: refresh_token || null,
      })
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating email account:", createError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create email account" 
        }),
        { status: 500, headers }
      );
    }
    
    console.log("Successfully created new email account connection");
    return new Response(
      JSON.stringify({ 
        success: true, 
        account: newAccount 
      }),
      { status: 200, headers }
    );
    
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "An unexpected error occurred" 
      }),
      { status: 500, headers }
    );
  }
});
