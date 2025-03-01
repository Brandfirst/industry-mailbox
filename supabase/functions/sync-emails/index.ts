
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { accountId } = await req.json()
    
    if (!accountId) {
      console.error("Missing accountId in request")
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing email account ID",
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      )
    }

    console.log(`Starting sync for account: ${accountId}`)
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    )
    
    // Get the email account
    const { data: account, error: accountError } = await supabaseAdmin
      .from("email_accounts")
      .select("*")
      .eq("id", accountId)
      .single()
    
    if (accountError || !account) {
      console.error("Error fetching email account:", accountError)
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email account not found or access denied",
          details: accountError?.message
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404 
        }
      )
    }
    
    // Fetch emails from Google API using the account's access token
    console.log("Fetching emails using access token")
    const emails = await fetchEmailsFromGmail(account.access_token, account.id)
    
    if (!emails || emails.error) {
      console.error("Error fetching emails:", emails?.error)
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch emails from Gmail",
          details: emails?.error
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      )
    }
    
    // Insert the emails into the database
    console.log(`Inserting ${emails.length} newsletters into database`)
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("newsletters")
      .upsert(
        emails.map(email => ({
          title: email.subject,
          sender: email.from.name,
          sender_email: email.from.email,
          content: email.body,
          preview: email.snippet || "",
          published_at: email.date,
          email_id: account.id
        })),
        { onConflict: "email_id, title, published_at" }
      )
    
    if (insertError) {
      console.error("Error inserting newsletters:", insertError)
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to save newsletters",
          details: insertError.message
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      )
    }
    
    // Update the last_sync timestamp
    await supabaseAdmin
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId)
    
    return new Response(
      JSON.stringify({
        success: true,
        count: emails.length,
        synced: emails.map(e => e.subject)
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    )
  } catch (error) {
    console.error("Uncaught error in sync-emails:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred while syncing emails",
        details: error.message || String(error)
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    )
  }
})

// Mock function to fetch emails from Gmail API
// In a real implementation, this would use the Gmail API
async function fetchEmailsFromGmail(accessToken: string, accountId: string) {
  try {
    console.log("Using access token to fetch emails from Gmail")
    
    // In a real implementation, you would make API calls to Gmail using the accessToken
    // For now, we'll return mock data for demonstration purposes
    return [
      {
        id: "email1",
        subject: "Weekly Tech Newsletter",
        from: { name: "Tech News", email: "news@tech.com" },
        date: new Date().toISOString(),
        snippet: "The latest in tech news this week...",
        body: `
          <h1>Tech Weekly</h1>
          <p>Hello! Here are the top stories in tech this week:</p>
          <ul>
            <li>New AI developments from OpenAI</li>
            <li>Apple announces latest product line</li>
            <li>Web development trends for 2024</li>
          </ul>
          <p>Stay tuned for more updates!</p>
        `
      },
      {
        id: "email2",
        subject: "Finance Monthly Update",
        from: { name: "Finance Insights", email: "updates@finance.org" },
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        snippet: "Monthly roundup of financial news...",
        body: `
          <h1>Finance Monthly</h1>
          <p>Welcome to this month's finance update!</p>
          <h2>Market Trends</h2>
          <p>The market has shown significant growth in the tech sector, while financial services have remained stable.</p>
          <h2>Investment Tips</h2>
          <p>Consider diversifying your portfolio with these emerging market opportunities...</p>
        `
      },
      {
        id: "email3",
        subject: "Health & Wellness Newsletter",
        from: { name: "Wellness Daily", email: "hello@wellness.co" },
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        snippet: "Tips for staying healthy this season...",
        body: `
          <h1>Health & Wellness Tips</h1>
          <p>Dear reader,</p>
          <p>As the season changes, here are some tips to keep you healthy:</p>
          <ol>
            <li>Stay hydrated with at least 8 glasses of water daily</li>
            <li>Incorporate 30 minutes of moderate exercise</li>
            <li>Practice mindfulness to reduce stress</li>
            <li>Ensure you're getting 7-8 hours of quality sleep</li>
          </ol>
          <p>Wishing you the best of health!</p>
        `
      }
    ]
  } catch (error) {
    console.error("Error in fetchEmailsFromGmail:", error)
    return { error: error.message || "Failed to fetch emails from Gmail" }
  }
}
