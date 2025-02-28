
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  userId: string;
  authCode: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { userId, authCode } = body;

    if (!userId || !authCode) {
      return new Response(
        JSON.stringify({ error: "userId and authCode are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get credentials from environment variables
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") || `${req.headers.get("origin")}/admin`;

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error - OAuth credentials missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Exchanging auth code for tokens. Redirect URI: ${redirectUri}`);

    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Error exchanging auth code for tokens:", errorData);
      return new Response(
        JSON.stringify({ error: "Failed to exchange auth code for tokens" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokens = await tokenResponse.json();
    console.log("Received tokens from Google");

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error("Error getting user info from Google");
      return new Response(
        JSON.stringify({ error: "Failed to get user info from Google" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userInfo = await userInfoResponse.json();
    console.log("Received user info from Google");

    // Store the connection in the database
    const { data, error } = await supabase
      .from("email_accounts")
      .upsert(
        {
          user_id: userId,
          email: userInfo.email,
          provider: "gmail",
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || null, // Not all flows return a refresh token
          is_connected: true,
          last_sync: null,
        },
        { onConflict: "user_id,email" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("Error storing email connection:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store email connection" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return success with some basic info (but not tokens for security)
    return new Response(
      JSON.stringify({
        success: true,
        email: userInfo.email,
        accountId: data.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
