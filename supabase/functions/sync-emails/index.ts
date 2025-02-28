
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
  accountId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: RequestBody = await req.json();
    const { accountId } = body;

    if (!accountId) {
      return new Response(
        JSON.stringify({ error: "accountId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the email account from the database
    const { data: account, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError || !account) {
      console.error("Error fetching email account:", accountError);
      return new Response(
        JSON.stringify({ error: "Email account not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!account.is_connected) {
      return new Response(
        JSON.stringify({ error: "Email account is not connected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token is expired and refresh if needed
    let accessToken = account.access_token;
    if (account.refresh_token) {
      // In a real implementation, you'd check if the token is expired
      // and refresh it if needed using the refresh_token
      // For now, we'll just use the existing access token
    }

    // Search for newsletters in Gmail
    // We'll look for emails with common newsletter patterns in the subject
    const query = "category:promotions OR label:newsletters OR subject:newsletter";
    const gmailResponse = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!gmailResponse.ok) {
      const errorText = await gmailResponse.text();
      console.error("Error fetching messages from Gmail:", errorText);
      
      // If token is invalid, mark the account as disconnected
      if (gmailResponse.status === 401) {
        await supabase
          .from("email_accounts")
          .update({ is_connected: false })
          .eq("id", accountId);
          
        return new Response(
          JSON.stringify({ error: "Gmail authentication failed. Please reconnect your account." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch messages from Gmail" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messagesData = await gmailResponse.json();
    const messageIds = messagesData.messages || [];
    
    console.log(`Found ${messageIds.length} potential newsletter messages`);
    
    // In a real implementation, you would:
    // 1. Fetch each message's full content
    // 2. Parse it to extract newsletter content
    // 3. Store it in your newsletters table
    
    // For this demo, we'll just update the last_sync time
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating last_sync time:", updateError);
    }

    // Return success with message count
    return new Response(
      JSON.stringify({
        success: true,
        message: `Found ${messageIds.length} potential newsletters`,
        syncedAt: new Date().toISOString(),
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
