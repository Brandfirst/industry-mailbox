
// Sync-emails edge function
// This function fetches emails from Gmail and syncs them to the database
// Note: Core application logic is included directly in this file

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface for incoming request body
interface SyncEmailsRequest {
  accountId: string;
}

// Function to refresh a Google token if needed
async function refreshGoogleToken(supabase, accountId) {
  console.log(`Checking if token refresh needed for account ${accountId}`);
  
  try {
    // Get the email account data
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    
    if (accountError) {
      console.error("Error retrieving account:", accountError);
      throw new Error(`Account not found: ${accountError.message}`);
    }
    
    if (!account || !account.refresh_token) {
      console.error("Account has no refresh token");
      throw new Error("Account is missing refresh token");
    }
    
    // We'll always refresh the token to ensure it's valid
    console.log("Refreshing Google token");
    
    const refreshParams = new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID") || "",
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") || "",
      refresh_token: account.refresh_token,
      grant_type: "refresh_token"
    });
    
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: refreshParams.toString()
    });
    
    const tokenData = await response.json();
    
    if (!response.ok) {
      console.error("Token refresh failed:", tokenData);
      throw new Error(`Failed to refresh token: ${tokenData.error}`);
    }
    
    // Update the account with the new access token
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update({ 
        access_token: tokenData.access_token,
        // Note: We don't update refresh_token as it doesn't change unless reauthorized
      })
      .eq('id', accountId);
    
    if (updateError) {
      console.error("Error updating access token:", updateError);
      throw new Error(`Failed to update token: ${updateError.message}`);
    }
    
    return tokenData.access_token;
  } catch (error) {
    console.error("Error in refreshGoogleToken:", error);
    throw error;
  }
}

// Function to fetch emails from Gmail
async function fetchGmailMessages(accessToken, account, maxResults = 10) {
  console.log(`Fetching up to ${maxResults} Gmail messages`);
  
  try {
    // Query for newsletters - look for common newsletter markers
    const query = "category:promotions OR category:updates OR label:newsletters OR unsubscribe";
    const encodedQuery = encodeURIComponent(query);
    
    // First get message IDs
    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodedQuery}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!listResponse.ok) {
      const errorData = await listResponse.json();
      console.error("Gmail API error:", errorData);
      throw new Error(`Gmail API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await listResponse.json();
    
    if (!data.messages || !Array.isArray(data.messages)) {
      console.log("No messages found matching criteria");
      return [];
    }
    
    console.log(`Found ${data.messages.length} messages, fetching details...`);
    
    // Now fetch full message details for each ID
    const messagePromises = data.messages.map(async (message) => {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!msgResponse.ok) {
        console.error(`Error fetching message ${message.id}:`, await msgResponse.text());
        return null;
      }
      
      return await msgResponse.json();
    });
    
    // Wait for all message detail requests to complete
    const messages = await Promise.all(messagePromises);
    return messages.filter(msg => msg !== null); // Remove any failed fetches
  } catch (error) {
    console.error("Error fetching Gmail messages:", error);
    throw error;
  }
}

// Process Gmail message to extract newsletter data
function extractNewsletterData(message, accountId) {
  if (!message || !message.payload) {
    console.log("Invalid message structure", message?.id);
    return null;
  }
  
  // Extract headers
  const headers = message.payload.headers || [];
  
  // Find important headers
  const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
  const from = headers.find(h => h.name === "From")?.value || "";
  const date = headers.find(h => h.name === "Date")?.value || "";
  
  // Parse sender name and email
  let senderName = from;
  let senderEmail = "";
  
  const emailMatch = from.match(/<([^>]+)>/) || from.match(/([^\s]+@[^\s]+)/);
  if (emailMatch) {
    senderEmail = emailMatch[1];
    senderName = from.replace(emailMatch[0], "").trim();
    // Remove quotes if present
    senderName = senderName.replace(/^"(.*)"$/, "$1");
  }
  
  // Simple industry detection based on domains and sender names
  let industry = "Other";
  const lowerSender = senderName.toLowerCase();
  const lowerEmail = senderEmail.toLowerCase();
  
  if (lowerEmail.includes("tech") || lowerEmail.includes("software") || 
      lowerSender.includes("tech") || lowerEmail.includes("google") || 
      lowerEmail.includes("microsoft")) {
    industry = "Technology";
  } else if (lowerEmail.includes("finance") || lowerEmail.includes("bank") || 
             lowerSender.includes("finance") || lowerSender.includes("bank")) {
    industry = "Finance";
  } else if (lowerEmail.includes("market") || lowerSender.includes("market")) {
    industry = "Marketing";
  }
  
  // Extract message body - simplified approach
  let content = "";
  let plainContent = "";
  
  // Helper function to recursively get content from parts
  function getContent(part) {
    if (!part) return;
    
    if (part.body && part.body.data) {
      // Base64 decode the content
      try {
        const decoded = atob(part.body.data.replace(/-/g, '+').replace(/_/g, '/'));
        
        if (part.mimeType === "text/html") {
          content = decoded;
        } else if (part.mimeType === "text/plain") {
          plainContent = decoded;
        }
      } catch (e) {
        console.error("Error decoding content:", e);
      }
    }
    
    // Check for nested parts
    if (part.parts && Array.isArray(part.parts)) {
      part.parts.forEach(getContent);
    }
  }
  
  getContent(message.payload);
  
  // Use plain content as fallback if no HTML content
  if (!content && plainContent) {
    content = `<pre>${plainContent}</pre>`;
  }
  
  // Create preview text (first 150 chars of plain content)
  const preview = plainContent.substring(0, 150).trim() + (plainContent.length > 150 ? "..." : "");
  
  // Parse date
  let publishedAt;
  try {
    publishedAt = new Date(date).toISOString();
  } catch (e) {
    publishedAt = new Date().toISOString();
    console.error("Error parsing date:", e);
  }
  
  return {
    title: subject,
    sender: senderName,
    sender_email: senderEmail,
    preview: preview,
    content: content,
    industry: industry,
    published_at: publishedAt,
    email_id: accountId,
    gmail_message_id: message.id,
    gmail_thread_id: message.threadId
  };
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
    const { accountId } = await req.json() as SyncEmailsRequest;
    
    if (!accountId) {
      return new Response(
        JSON.stringify({ success: false, error: "Account ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    console.log(`Starting sync for account ID: ${accountId}`);
    
    // Refresh the Google token
    const accessToken = await refreshGoogleToken(supabase, accountId);
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to obtain access token",
          status: 401
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Get account details (for reference in processing)
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();
    
    if (accountError) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Account not found",
          status: 404
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Fetch messages from Gmail
    const messages = await fetchGmailMessages(accessToken, account, 20);
    console.log(`Retrieved ${messages.length} messages from Gmail`);
    
    // Process messages into newsletter format
    const newsletters = messages
      .map(msg => extractNewsletterData(msg, accountId))
      .filter(newsletter => newsletter !== null);
    
    console.log(`Extracted ${newsletters.length} newsletters from messages`);
    
    // Track successful and failed inserts
    const synced = [];
    const failed = [];
    
    // Insert each newsletter into the database
    for (const newsletter of newsletters) {
      try {
        // Check if this message already exists
        const { data: existing, error: checkError } = await supabase
          .from('newsletters')
          .select('id')
          .eq('gmail_message_id', newsletter.gmail_message_id)
          .maybeSingle();
        
        if (checkError) {
          console.error("Error checking for existing newsletter:", checkError);
        }
        
        if (existing) {
          console.log(`Newsletter already exists for message ID ${newsletter.gmail_message_id}`);
          continue;
        }
        
        // Insert the new newsletter
        const { data, error } = await supabase
          .from('newsletters')
          .insert(newsletter)
          .select('id')
          .single();
        
        if (error) {
          console.error("Error inserting newsletter:", error);
          failed.push({ title: newsletter.title, error: error.message });
        } else {
          synced.push({ id: data.id, title: newsletter.title });
        }
      } catch (error) {
        console.error("Error processing newsletter:", error);
        failed.push({ title: newsletter.title, error: String(error) });
      }
    }
    
    // Update the last_sync timestamp on the email account
    const { error: syncUpdateError } = await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);
    
    if (syncUpdateError) {
      console.error("Error updating last_sync timestamp:", syncUpdateError);
    }
    
    // Determine if this was a partial success
    const partial = failed.length > 0;
    
    return new Response(
      JSON.stringify({
        success: true,
        partial,
        count: synced.length,
        synced,
        failed,
        warning: partial ? "Some newsletters failed to sync" : null,
        details: partial ? "Check the failed array for details on newsletters that could not be synced" : null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in sync-emails handler:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Error syncing emails: ${error.message || "Unknown error"}`,
        details: String(error),
        status: 500
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
