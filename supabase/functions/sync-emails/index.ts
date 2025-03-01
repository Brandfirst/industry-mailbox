
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Setup Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SyncRequest {
  accountId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Sync emails function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { accountId } = await req.json() as SyncRequest;
    console.log(`Processing sync request for account ID: ${accountId}`);
    
    if (!accountId) {
      console.error("Missing required parameter: accountId");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameter: accountId",
          status: 400 // Return status in the response body
        }),
        { 
          status: 200, // Always return 200 to avoid client-side errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      );
    }
    
    // Fetch the email account to verify it exists
    const { data: account, error: accountError } = await supabase
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single();
    
    if (accountError) {
      console.error("Error fetching email account:", accountError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Error fetching email account", 
          details: accountError.message,
          status: 404 // Return status in the response body
        }),
        { 
          status: 200, // Always return 200 to avoid client-side errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      );
    }
    
    if (!account) {
      console.error("Email account not found");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email account not found",
          status: 404 // Return status in the response body
        }),
        { 
          status: 200, // Always return 200 to avoid client-side errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      );
    }
    
    console.log(`Found email account: ${account.email}`);
    
    // For demonstration, let's simulate fetching emails
    // In a real implementation, you would call Gmail API here
    
    // Generate random fake newsletters for demonstration
    const demoNewsletters = generateDemoNewsletters(account);
    
    // Insert the demo newsletters
    const { data: insertedData, error: insertError } = await supabase
      .from("newsletters")
      .insert(demoNewsletters)
      .select();
      
    if (insertError) {
      console.error("Error inserting demo newsletters:", insertError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Error inserting newsletters", 
          details: insertError.message,
          status: 500 // Return status in the response body
        }),
        { 
          status: 200, // Always return 200 to avoid client-side errors
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      );
    }
    
    // Update the last_sync timestamp
    const { error: updateError } = await supabase
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);
      
    if (updateError) {
      console.log("Error updating last_sync timestamp:", updateError);
      // We don't want to fail the entire operation if just the timestamp update fails
    }
    
    const syncedNewsletters = insertedData || [];
    console.log(`Successfully synced ${syncedNewsletters.length} newsletters`);
    
    return new Response(
      JSON.stringify({
        success: true,
        count: syncedNewsletters.length,
        synced: syncedNewsletters.map(n => n.id),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error("Unexpected error in sync-emails function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "An unexpected error occurred", 
        details: error.message || String(error),
        status: 500 // Return status in the response body
      }),
      { 
        status: 200, // Always return 200 to avoid client-side errors
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    );
  }
};

// Helper function to generate fake newsletter data for testing
function generateDemoNewsletters(account) {
  const industries = ["Technology", "Business", "Health", "Education", "Finance"];
  const senders = ["TechCrunch", "Harvard Business Review", "Mayo Clinic", "Khan Academy", "WSJ Money"];
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 random newsletters
  
  const newsletters = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const industryIndex = Math.floor(Math.random() * industries.length);
    const dateOffset = Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000; // 0-7 days back
    const publishedDate = new Date(now.getTime() - dateOffset);
    
    newsletters.push({
      title: `${senders[industryIndex]} Newsletter - ${publishedDate.toLocaleDateString()}`,
      sender: senders[industryIndex],
      sender_email: account.email,
      email_id: account.id,
      industry: industries[industryIndex],
      preview: `Latest news from ${industries[industryIndex]} sector`,
      content: `<h1>Newsletter from ${senders[industryIndex]}</h1><p>This is a demo newsletter generated for testing purposes.</p><p>It was created on ${publishedDate.toLocaleString()}</p>`,
      published_at: publishedDate.toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  return newsletters;
}

serve(handler);
