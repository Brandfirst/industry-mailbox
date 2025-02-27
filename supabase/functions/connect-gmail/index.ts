
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Get environment variables
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID") || "";
  const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || "";
  const redirectUri = req.headers.get("origin") + "/admin";

  try {
    // Initialize Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get request body
    const { userId, authCode } = await req.json();
    
    if (!userId || !authCode) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    console.log(`Processing Gmail connection for user ${userId} with auth code`);
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authCode,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Error exchanging auth code for tokens:", tokenData);
      return new Response(
        JSON.stringify({ error: "Failed to exchange authorization code for tokens" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const { access_token, refresh_token, expires_in } = tokenData;
    
    // Get user email from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("Error fetching user info:", userInfo);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user info" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    // Store email account in database
    const { data, error } = await supabase
      .from("email_accounts")
      .upsert(
        {
          user_id: userId,
          email: userInfo.email,
          provider: "gmail",
          access_token,
          refresh_token,
          is_connected: true,
        },
        { onConflict: "user_id, email" }
      )
      .select("id")
      .single();
    
    if (error) {
      console.error("Error storing email account:", error);
      return new Response(
        JSON.stringify({ error: "Failed to store email account" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, accountId: data.id }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error connecting Gmail account:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
