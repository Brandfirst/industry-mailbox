
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Define CORS headers to ensure frontend can communicate with this function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncRequestBody {
  accountId: string;
}

serve(async (req: Request): Promise<Response> => {
  console.log("Sync-emails function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const requestData: SyncRequestBody = await req.json();
    const { accountId } = requestData;

    if (!accountId) {
      console.error("Missing accountId in request");
      return new Response(
        JSON.stringify({ success: false, error: "Missing accountId parameter" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log(`Processing sync for email account: ${accountId}`);

    // Get the email account details
    const { data: emailAccount, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError || !emailAccount) {
      console.error("Error fetching email account:", accountError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email account not found",
          details: accountError
        }),
        { 
          status: 404, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log(`Found email account: ${emailAccount.email}`);

    // Since we're not actually connecting to Gmail API yet,
    // we'll insert some sample newsletters for the demo
    const sampleNewsletters = [
      {
        email_id: accountId,
        title: "Weekly Tech Roundup",
        sender: "TechNews",
        sender_email: "news@technewsletter.com",
        content: "<h1>This Week in Technology</h1><p>Here are the top stories from this week in technology...</p>",
        published_at: new Date().toISOString(),
        industry: "Technology"
      },
      {
        email_id: accountId,
        title: "Financial Markets Today",
        sender: "MarketWatch",
        sender_email: "updates@marketwatch.com",
        content: "<h1>Market Summary</h1><p>The S&P 500 rose 1.2% today, while tech stocks...</p>",
        published_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        industry: "Finance"
      },
      {
        email_id: accountId,
        title: "Health & Wellness Monthly",
        sender: "Wellness Today",
        sender_email: "newsletter@wellnesstoday.com",
        content: "<h1>Stay Healthy This Month</h1><p>Try these five exercises to improve your posture...</p>",
        published_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        industry: "Health"
      }
    ];

    // Insert the sample newsletters
    const { data: insertedNewsletters, error: insertError } = await supabase
      .from("newsletters")
      .upsert(
        sampleNewsletters, 
        { 
          onConflict: 'email_id, title, sender_email', 
          ignoreDuplicates: true 
        }
      );

    if (insertError) {
      console.error("Error inserting sample newsletters:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to insert newsletters",
          details: insertError
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    console.log("Successfully inserted sample newsletters");

    // Update the email account's last_sync timestamp
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating last_sync timestamp:", updateError);
      // Continue anyway since we did insert the newsletters
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: sampleNewsletters.length,
        count: sampleNewsletters.length,
        message: "Successfully synced sample newsletters"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error) {
    console.error("Unhandled error in sync-emails function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error", 
        details: error.message || String(error)
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
