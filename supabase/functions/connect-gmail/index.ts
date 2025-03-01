
// follow redirects
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading connect-gmail function...");

serve(async (req) => {
  console.log("Request received:", req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request (CORS preflight)");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const { code, userId, redirectUri, timestamp } = await req.json();
    
    console.log("Request data received:", { 
      code: code ? "REDACTED" : null, 
      userId, 
      redirectUri,
      timestamp
    });
    
    // Validate inputs
    if (!code) {
      console.error("Missing authorization code");
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!userId) {
      console.error("Missing user ID");
      return new Response(
        JSON.stringify({ success: false, error: "Missing user ID" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Retrieve configuration from environment variables
    const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const REDIRECT_URL = redirectUri || Deno.env.get("GOOGLE_REDIRECT_URL");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    // Validate environment variables
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Missing Google client configuration");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error", 
          details: "Missing Google client configuration" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Create Supabase client with service role key
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error", 
          details: "Missing Supabase configuration" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Environment config checks passed");
    console.log(`Using redirect URL: ${REDIRECT_URL}`);
    
    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Exchange authorization code for tokens
    console.log("Exchanging authorization code for access token...");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: "authorization_code",
      }),
    });
    
    const tokenData = await tokenResponse.json();
    console.log("Token exchange response status:", tokenResponse.status);
    
    if (!tokenResponse.ok) {
      console.error("Error exchanging code for token:", tokenData);
      
      // Extract more detailed error information
      const googleError = tokenData.error || null;
      const googleErrorDescription = tokenData.error_description || null;
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to exchange authorization code for token", 
          details: tokenData,
          googleError,
          googleErrorDescription,
          statusCode: tokenResponse.status
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get user info from Google
    console.log("Getting user info from Google...");
    const { access_token, refresh_token } = tokenData;
    
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    
    const googleUser = await userInfoResponse.json();
    console.log("Obtained user info from Google:", { email: googleUser.email });
    
    if (!googleUser.email) {
      console.error("Email not available in Google user data:", googleUser);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email not available from Google", 
          details: googleUser 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Check if account already exists
    console.log("Checking if email account already exists...");
    const { data: existingAccounts, error: fetchError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("email", googleUser.email);
    
    if (fetchError) {
      console.error("Error checking existing email accounts:", fetchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Database error when checking existing accounts", 
          details: fetchError 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    if (existingAccounts && existingAccounts.length > 0) {
      console.log("Account already exists, updating tokens...");
      const existingAccount = existingAccounts[0];
      
      // Update existing account with new tokens
      const { data: updatedAccount, error: updateError } = await supabase
        .from("email_accounts")
        .update({
          access_token,
          refresh_token,
          is_connected: true,
        })
        .eq("id", existingAccount.id)
        .select()
        .single();
      
      if (updateError) {
        console.error("Error updating existing account:", updateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to update existing account", 
            details: updateError 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          account: updatedAccount,
          message: "Existing account reconnected"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Create new email account
    console.log("Creating new email account...");
    const { data: newAccount, error: insertError } = await supabase
      .from("email_accounts")
      .insert({
        user_id: userId,
        email: googleUser.email,
        provider: "gmail",
        access_token,
        refresh_token,
        is_connected: true,
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error creating new email account:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to create email account", 
          details: insertError 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Successfully created new email account:", { email: newAccount.email, id: newAccount.id });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        account: newAccount,
        message: "New account connected successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (err) {
    console.error("Unhandled exception in connect-gmail function:", err);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Server error processing request",
        details: err.message,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
