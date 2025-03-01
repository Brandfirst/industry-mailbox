
// Connect-gmail edge function
// This function handles the OAuth flow with Google and stores credentials in the database

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for incoming request body
interface ConnectGmailRequest {
  code: string;
  userId: string;
  redirectUri: string;
  timestamp?: string;
}

// Main handler function
const handler = async (req: Request): Promise<Response> => {
  // Create a Supabase client with the service role key
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Parse request body
    const { code, userId, redirectUri, timestamp } = await req.json() as ConnectGmailRequest;
    
    if (!code || !userId || !redirectUri) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters", 
          details: "code, userId, and redirectUri are required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Processing OAuth code for user ${userId} at ${timestamp || "unknown time"}`);
    console.log(`Using final redirect URI: ${redirectUri}`);
    
    // Get Google OAuth credentials from environment variables
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error", 
          details: "Google OAuth credentials are not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Exchange authorization code for tokens
    const tokenParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    });
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString()
    });
    
    const tokenData = await tokenResponse.json();
    
    // Check if token exchange was successful
    if (!tokenResponse.ok) {
      console.error("Google OAuth error:", tokenData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to exchange code for tokens",
          googleError: tokenData.error,
          googleErrorDescription: tokenData.error_description,
          tokenInfo: { 
            status: tokenResponse.status,
            statusText: tokenResponse.statusText
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get user info from Google to identify the email address
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    
    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error("Error fetching user info:", userInfo);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to get user information from Google", 
          details: userInfo 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Check if email account already exists for this user
    const { data: existingAccount, error: checkError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('email', userInfo.email)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing account:", checkError);
    }
    
    let accountId;
    
    // If account exists, update it; otherwise, create a new one
    if (existingAccount) {
      console.log(`Updating existing account for ${userInfo.email}`);
      
      const { data, error } = await supabase
        .from('email_accounts')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || existingAccount.refresh_token,
          is_connected: true
        })
        .eq('id', existingAccount.id)
        .select()
        .single();
      
      if (error) {
        console.error("Error updating email account:", error);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to update email account", 
            details: error 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      accountId = existingAccount.id;
    } else {
      console.log(`Creating new account for ${userInfo.email}`);
      
      // Create a new email account record
      const { data, error } = await supabase
        .from('email_accounts')
        .insert({
          user_id: userId,
          email: userInfo.email,
          provider: 'gmail',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          is_connected: true
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating email account:", error);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to create email account", 
            details: error 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      accountId = data.id;
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        account: {
          id: accountId,
          email: userInfo.email,
          provider: 'gmail'
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in connect-gmail handler:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Server error: ${error.message || "Unknown error"}`,
        details: String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

// Start the Deno server
serve(handler);
