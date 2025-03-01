import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle the OAuth code exchange and Google API call
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid request body",
        details: error?.message || String(error),
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const { code, redirectUri, userId, nonce, timestamp } = body;

  // Create Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Validate required parameters
  if (!code) {
    console.error("Missing OAuth code in request");
    return new Response(
      JSON.stringify({ success: false, error: "Missing OAuth code" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  if (!userId) {
    console.error("Missing user ID in request");
    return new Response(
      JSON.stringify({ success: false, error: "Missing user ID" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Debug the request parameters
  console.log("Processing Gmail OAuth request:", {
    hasCode: Boolean(code),
    codeLength: code ? code.length : 0,
    userId,
    redirectUri,
    timestamp,
    nonceProvided: Boolean(nonce),
  });

  try {
    // Get Google client credentials from env
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Google OAuth credentials not configured",
          statusCode: 500
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Exchange code for tokens using Google's OAuth endpoint
    console.log("Exchanging code for tokens...");
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      }
    );

    // Parse token response
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token exchange failed:", tokenData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to exchange OAuth code for token",
          googleError: tokenData.error,
          googleErrorDescription: tokenData.error_description,
          statusCode: tokenResponse.status,
          tokenInfo: {
            status: tokenResponse.status,
            statusText: tokenResponse.statusText,
          },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract tokens from response
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      console.error("No access token in response:", tokenData);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid token response from Google",
          statusCode: 400,
          details: { tokenData },
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user profile from Google API
    console.log("Getting user profile from Google...");
    const userProfileResponse = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // Parse user profile response
    const userProfile = await userProfileResponse.json();

    // Handle errors from Google API
    if (!userProfileResponse.ok) {
      console.error("Google user profile request failed:", userProfile);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to get Gmail profile: ${userProfile.error?.message || "Unknown error"}`,
          details: userProfile.error,
          statusCode: userProfileResponse.status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user's email address
    const email = userProfile.emailAddress;

    if (!email) {
      console.error("Email not available in Google user data:", userProfile);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Could not retrieve email from Google account",
          details: userProfile,
          statusCode: 400,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Save account in database
    console.log(`Saving Gmail account ${email} for user ${userId}`);

    // Check if account already exists
    const { data: existingAccounts, error: queryError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("email", email);

    if (queryError) {
      console.error("Error checking for existing account:", queryError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database error while checking for existing account",
          details: queryError,
          statusCode: 500,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let accountId;
    let insertError;

    // If account exists, update it
    if (existingAccounts && existingAccounts.length > 0) {
      console.log(`Updating existing account for ${email}`);
      const { error, data } = await supabase
        .from("email_accounts")
        .update({
          access_token,
          refresh_token: refresh_token || null,
          is_connected: true,
        })
        .eq("id", existingAccounts[0].id)
        .select("*")
        .single();

      insertError = error;
      accountId = existingAccounts[0].id;
    } else {
      // Otherwise insert new account
      console.log(`Creating new account for ${email}`);
      const { error, data } = await supabase
        .from("email_accounts")
        .insert({
          user_id: userId,
          email,
          provider: "gmail",
          access_token,
          refresh_token: refresh_token || null,
          is_connected: true,
        })
        .select("*")
        .single();

      insertError = error;
      if (data) {
        accountId = data.id;
      }
    }

    if (insertError) {
      console.error("Error saving email account:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save email account in database",
          details: insertError,
          statusCode: 500,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get account to return to client
    const { data: account, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError) {
      console.error("Error fetching saved account:", accountError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Account saved but couldn't retrieve details",
          details: accountError,
          statusCode: 500,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Successfully connected Gmail account: ${email}`);
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        account,
        statusCode: 200,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error in connect-gmail function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Server error connecting Gmail account",
        details: error?.message || String(error),
        statusCode: 500,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

// Start HTTP server
serve(handler);
