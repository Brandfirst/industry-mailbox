
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { code, userId } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ success: false, error: "Authorization code is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Exchange the authorization code for access and refresh tokens
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    // Get the actual redirect URI from the request
    const origin = req.headers.get("origin");
    console.log("Request origin:", origin);
    
    // Use the GOOGLE_REDIRECT_URL from environment, but fallback to a constructed one if needed
    let redirectUri = Deno.env.get("GOOGLE_REDIRECT_URL");
    
    // If no redirect URL is provided, construct one from the origin
    if (!redirectUri && origin) {
      // If it's a preview domain, construct the right format
      if (origin.includes('preview--')) {
        const match = origin.match(/https:\/\/preview--([^.]+)\.([^/]+)/);
        if (match) {
          redirectUri = `https://preview--${match[1]}.${match[2]}/admin`;
        } else {
          redirectUri = `${origin}/admin`;
        }
      } else {
        redirectUri = `${origin}/admin`;
      }
    }
    
    console.log("Using redirect URI:", redirectUri);

    if (!clientId || !clientSecret || !redirectUri) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing Google OAuth configuration",
          details: {
            hasClientId: !!clientId,
            hasClientSecret: !!clientSecret,
            hasRedirectUri: !!redirectUri,
            origin: origin
          }
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log("Exchanging code for tokens with Google...");
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
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
    });

    const tokenData = await tokenResponse.json();
    
    // Log token response for debugging (without sensitive data)
    console.log("Token response status:", tokenResponse.status);
    console.log("Token response contains access_token:", !!tokenData.access_token);
    console.log("Token response contains refresh_token:", !!tokenData.refresh_token);
    
    if (!tokenResponse.ok) {
      console.error("Error exchanging code for tokens:", tokenData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to exchange authorization code",
          googleError: tokenData.error,
          googleErrorDescription: tokenData.error_description
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { access_token, refresh_token, expires_in } = tokenData as GoogleTokenResponse;

    if (!access_token) {
      return new Response(
        JSON.stringify({ success: false, error: "No access token returned from Google" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user email from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok || !userInfo.email) {
      console.error("Error fetching user info:", userInfo);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to get user email from Google" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const email = userInfo.email;
    
    // Calculate the token expiration date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

    // Store the connection in the database
    const { data: existingAccount, error: existingError } = await supabaseAdmin
      .from("email_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("email", email)
      .maybeSingle();
      
    if (existingError) {
      console.error("Error checking for existing account:", existingError);
    }
    
    let result;
    
    if (existingAccount) {
      // Update the existing account with new tokens
      result = await supabaseAdmin
        .from("email_accounts")
        .update({
          access_token,
          refresh_token: refresh_token || existingAccount.refresh_token, // Use existing if no new one
          expires_at: expiresAt.toISOString(),
          last_sync: null, // Reset last sync
          updated_at: new Date().toISOString()
        })
        .eq("id", existingAccount.id)
        .select()
        .single();
    } else {
      // Insert a new email account
      result = await supabaseAdmin
        .from("email_accounts")
        .insert({
          user_id: userId,
          provider: "google",
          email: email,
          access_token,
          refresh_token,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Database error:", result.error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to store email account" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, account: result.data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
