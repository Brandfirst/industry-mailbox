
// Follow Deno's ES modules
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
}

serve(async (req) => {
  try {
    // Handle CORS
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Environment Variables
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") || "";
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
    const GOOGLE_REDIRECT_URL = Deno.env.get("GOOGLE_REDIRECT_URL") || "";
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase configuration missing",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Google API configuration missing",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse JSON body
    const requestData = await req.json();
    const { code, userId, redirectUri } = requestData;
    
    // Extra logging for debugging
    console.log(`Processing request for user: ${userId}`);
    console.log(`Redirect URI from request: ${redirectUri}`);
    console.log(`Redirect URI from env: ${GOOGLE_REDIRECT_URL}`);
    
    // Validate required parameters
    if (!code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing authorization code",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing user ID",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    try {
      // Use the redirectUri from request or fall back to env variable
      const finalRedirectUri = redirectUri || GOOGLE_REDIRECT_URL;
      console.log(`Using final redirect URI: ${finalRedirectUri}`);
      
      // Exchange auth code for access and refresh tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: finalRedirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error("Google OAuth token error:", tokenData);
        
        // Provide more detailed error information
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to obtain Google access token",
            googleError: tokenData.error,
            googleErrorDescription: tokenData.error_description,
            tokenInfo: {
              status: tokenResponse.status,
              statusText: tokenResponse.statusText,
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // If we got here, we have valid tokens
      const { access_token, refresh_token, expires_in } = tokenData;
      
      // Use the access token to get user's Gmail profile
      const profileResponse = await fetch(
        "https://www.googleapis.com/gmail/v1/users/me/profile",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        console.error("Failed to get Gmail profile:", await profileResponse.text());
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to get Gmail profile",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const profileData = await profileResponse.json();
      const { emailAddress } = profileData;
      
      console.log(`Successfully retrieved Gmail profile for: ${emailAddress}`);

      // Check if account already exists
      const { data: existingAccounts, error: fetchError } = await supabase
        .from("email_accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("email", emailAddress);

      if (fetchError) {
        console.error("Error checking for existing account:", fetchError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Database error while checking for existing account",
            details: fetchError.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      let account;
      
      // Update or insert the email account
      if (existingAccounts && existingAccounts.length > 0) {
        // Update existing account
        const { data, error } = await supabase
          .from("email_accounts")
          .update({
            access_token,
            refresh_token,
            is_connected: true,
          })
          .eq("id", existingAccounts[0].id)
          .select()
          .single();

        if (error) {
          console.error("Error updating existing account:", error);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to update existing account",
              details: error.message,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        account = data;
        console.log(`Updated existing email account for: ${emailAddress}`);
      } else {
        // Insert new account
        const { data, error } = await supabase
          .from("email_accounts")
          .insert({
            user_id: userId,
            email: emailAddress,
            provider: "gmail",
            access_token,
            refresh_token,
            is_connected: true,
          })
          .select()
          .single();

        if (error) {
          console.error("Error inserting new account:", error);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to create new account",
              details: error.message,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        account = data;
        console.log(`Created new email account for: ${emailAddress}`);
      }

      // Success response with account data
      return new Response(
        JSON.stringify({
          success: true,
          account,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unexpected error occurred",
          details: error.message || String(error),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Fatal error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Fatal error processing request",
        details: error.message || String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
