
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.1";

console.log("connect-gmail function loaded");

// Define a type for the expected request body
interface ConnectGmailRequest {
  code: string;
  userId: string;
  redirectUri?: string;
}

const CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
const DEFAULT_REDIRECT_URI = Deno.env.get("GOOGLE_REDIRECT_URL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Missing required environment variables for Google OAuth");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required environment variables for Supabase");
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Start time for tracking performance
  const startTime = Date.now();
  
  try {
    const supabase = createClient(
      SUPABASE_URL || "",
      SUPABASE_SERVICE_ROLE_KEY || ""
    );

    // Attempt to parse the request body
    const requestBody = await req.json().catch((err) => {
      console.error("Error parsing request body:", err);
      return null;
    });

    if (!requestBody) {
      console.error("Invalid request body");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request body",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Type cast and destructure the request body
    const { code, userId, redirectUri } = requestBody as ConnectGmailRequest;

    // Validate required parameters
    if (!code) {
      console.error("Missing required parameter: code");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameter: code",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    if (!userId) {
      console.error("Missing required parameter: userId");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameter: userId",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Use the provided redirect URI or fall back to the default
    const actualRedirectUri = redirectUri || DEFAULT_REDIRECT_URI || "https://preview--industry-mailbox.lovable.app/admin";
    
    console.log(`Using redirect URI: ${actualRedirectUri}`);
    console.log(`Using client ID: ${CLIENT_ID?.substring(0, 10)}...`);

    // Exchange authorization code for access token
    console.log("Exchanging authorization code for tokens");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID || "",
        client_secret: CLIENT_SECRET || "",
        redirect_uri: actualRedirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    
    // Log token response status for debugging
    console.log(`Token exchange responded with status: ${tokenResponse.status}`);

    if (!tokenResponse.ok) {
      console.error("Error getting tokens from Google:", tokenData);
      
      // Extract Google's error information
      const googleError = tokenData?.error || "unknown_error";
      const googleErrorDescription = tokenData?.error_description || "No description provided";
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to get tokens from Google",
          googleError,
          googleErrorDescription,
          tokenInfo: {
            status: tokenResponse.status,
            responseType: tokenResponse.headers.get("content-type"),
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Successfully obtained tokens!
    const { access_token, refresh_token, expires_in } = tokenData;
    console.log(`Successfully obtained access token (expires in ${expires_in}s)`);

    if (!access_token) {
      console.error("Access token missing from Google response");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Access token missing from Google response",
          tokenInfo: tokenData,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get user info with the access token
    console.log("Fetching user info from Google");
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/gmail/v1/users/me/profile",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (!userInfoResponse.ok) {
        const errorData = await userInfoResponse.json();
        console.error("Error getting user info:", errorData);
        
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to get user info from Google",
            details: errorData,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      const userInfo = await userInfoResponse.json();
      console.log(`Got user info for email: ${userInfo.emailAddress}`);

      // Check if this email account is already connected
      const { data: existingAccounts, error: existingError } = await supabase
        .from("email_accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("email", userInfo.emailAddress);

      if (existingError) {
        console.error("Error checking for existing account:", existingError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Error checking for existing account",
            details: existingError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      if (existingAccounts && existingAccounts.length > 0) {
        // Update the existing account with the new tokens
        const { data: updatedAccount, error: updateError } = await supabase
          .from("email_accounts")
          .update({
            access_token,
            refresh_token: refresh_token || null,
            is_connected: true,
          })
          .eq("id", existingAccounts[0].id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating existing account:", updateError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Error updating existing account",
              details: updateError,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }

        const endTime = Date.now();
        console.log(`Gmail connection updated successfully in ${endTime - startTime}ms`);
        
        return new Response(
          JSON.stringify({
            success: true,
            account: updatedAccount,
            message: "Email account updated successfully",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }

      // Create a new email account
      const { data: newAccount, error: insertError } = await supabase
        .from("email_accounts")
        .insert({
          user_id: userId,
          email: userInfo.emailAddress,
          provider: "gmail",
          access_token,
          refresh_token: refresh_token || null,
          is_connected: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting new account:", insertError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Error inserting new account",
            details: insertError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      const endTime = Date.now();
      console.log(`Gmail connection created successfully in ${endTime - startTime}ms`);
      
      return new Response(
        JSON.stringify({
          success: true,
          account: newAccount,
          message: "Email account connected successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (userInfoError) {
      console.error("Exception fetching user info:", userInfoError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Exception fetching user info",
          details: String(userInfoError),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (e) {
    console.error("Unhandled exception:", e);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: String(e),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
