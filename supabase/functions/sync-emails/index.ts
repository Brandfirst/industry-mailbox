
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request payload
    const { accountId } = await req.json();
    
    // Log the request
    console.log(`Sync request received for account: ${accountId}`);
    
    if (!accountId) {
      console.error("No accountId provided in the request");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing account ID",
        }), 
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Create Supabase client using the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    
    // Get account details
    const { data: account, error: accountError } = await supabaseAdmin
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();
    
    if (accountError || !account) {
      console.error("Error fetching account:", accountError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Account not found or error fetching account",
          details: accountError
        }), 
        { 
          status: 404, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
    // Check if the account is connected
    if (!account.is_connected) {
      console.error("Account is not connected");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email account is not connected",
        }), 
        { 
          status: 400, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
    console.log(`Processing sync for email: ${account.email}, provider: ${account.provider}`);
    
    // In a real implementation, you would:
    // 1. Use the account's access_token to fetch emails from the provider (Gmail, etc.)
    // 2. Process the emails to extract newsletter data
    // 3. Store the newsletters in the database
    
    // For this implementation, we'll just create a few sample newsletters
    // This is temporary until full Gmail API integration is implemented
    
    // Sample newsletter data
    const sampleNewsletters = [
      {
        title: "Tech Weekly Update",
        sender: "TechCrunch",
        sender_email: "news@techcrunch.com",
        content: "<h1>Latest in Tech</h1><p>Here are this week's top tech stories...</p>",
        published_at: new Date().toISOString(),
        email_id: accountId,
        category_id: 1, // Technology
      },
      {
        title: "Business Insights",
        sender: "Harvard Business Review",
        sender_email: "newsletters@hbr.org",
        content: "<h1>Business Trends</h1><p>The latest business research and insights...</p>",
        published_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        email_id: accountId,
        category_id: 2, // Business
      },
      {
        title: "Health & Wellness",
        sender: "WebMD",
        sender_email: "health@webmd.com",
        content: "<h1>Health Tips</h1><p>Stay healthy with these tips...</p>",
        published_at: new Date(Date.now() - 172800000).toISOString(), // Two days ago
        email_id: accountId,
        category_id: 3, // Health
      },
    ];
    
    // Insert the sample newsletters
    const { data: insertedNewsletters, error: insertError } = await supabaseAdmin
      .from("newsletters")
      .upsert(
        sampleNewsletters.map(newsletter => ({
          ...newsletter,
          // Use a deterministic ID based on the email and title to avoid duplicates during testing
          id: btoa(`${accountId}-${newsletter.title}`).length % 1000 + 1000,
        })),
        { onConflict: 'id' }
      );
    
    if (insertError) {
      console.error("Error inserting newsletters:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to store newsletters",
          details: insertError
        }), 
        { 
          status: 500, 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          } 
        }
      );
    }
    
    // Update the last_sync timestamp for the email account
    const { error: updateError } = await supabaseAdmin
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);
    
    if (updateError) {
      console.error("Error updating last_sync:", updateError);
      // Continue even if there's an error updating the last_sync time
    }
    
    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        synced: sampleNewsletters.map(n => n.title),
        count: sampleNewsletters.length,
      }), 
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
    
  } catch (error) {
    console.error("Unexpected error in sync-emails function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred",
        details: String(error),
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
