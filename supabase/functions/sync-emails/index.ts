
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// Create a Supabase client with the auth context of the logged in user.
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface EmailSyncRequest {
  accountId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Parse the request body or return an error
  let body: EmailSyncRequest;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid request format",
        details: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Validate the request body
  if (!body.accountId) {
    console.error("Missing required parameters: accountId");
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing required parameter: accountId",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const accountId = body.accountId;
  console.log(`Starting sync process for account ID: ${accountId}`);

  try {
    // Create a supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the email account details
    const { data: accountData, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (accountError || !accountData) {
      console.error("Error fetching email account:", accountError || "Account not found");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch email account details",
          details: accountError?.message || "Account not found",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found email account: ${accountData.email}`);

    // For development and testing, we'll insert some sample newsletters
    // In a real implementation, you would connect to Gmail API and fetch real emails
    const sampleNewsletters = [];
    
    // Create 10 sample newsletters for testing
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      sampleNewsletters.push({
        title: `Newsletter #${i} from ${accountData.email}`,
        sender: `Sample Sender ${i}`,
        sender_email: `sender${i}@example.com`,
        industry: "Technology",
        preview: `This is a preview of newsletter #${i}`,
        content: `
          <html>
            <head>
              <title>Newsletter #${i}</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { color: #333; }
                p { line-height: 1.6; }
                .footer { margin-top: 40px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <h1>Newsletter #${i} from ${accountData.email}</h1>
              <p>Hello subscriber,</p>
              <p>This is sample content for newsletter #${i}. In a real implementation, this would be the actual content of the email.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, quam nisl tincidunt nunc, eget ultricies nisl nisl eget. Nullam euismod, nisl eget ultricies aliquam, quam nisl tincidunt nunc, eget ultricies nisl nisl eget.</p>
              <p>Best regards,<br>The Sample Team</p>
              <div class="footer">
                <p>You are receiving this email because you subscribed to our newsletter. If you no longer wish to receive these emails, you can unsubscribe at any time.</p>
              </div>
            </body>
          </html>
        `,
        published_at: date.toISOString(),
        email_id: accountId,
      });
    }

    console.log(`Created ${sampleNewsletters.length} sample newsletters`);

    // Insert the sample newsletters into the database
    const { data: insertedData, error: insertError } = await supabase
      .from("newsletters")
      .upsert(sampleNewsletters, {
        onConflict: "email_id, title, published_at",
        ignoreDuplicates: true,
      });

    if (insertError) {
      console.error("Error inserting newsletters:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to insert newsletters",
          details: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Successfully synced ${sampleNewsletters.length} newsletters`);

    // Update the last_sync timestamp for the email account
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);

    if (updateError) {
      console.error("Error updating last_sync timestamp:", updateError);
      // We don't want to fail the entire operation if this fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Sync completed successfully",
        count: sampleNewsletters.length,
        synced: sampleNewsletters.map(n => n.title),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error during sync:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred",
        details: error.message || String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
