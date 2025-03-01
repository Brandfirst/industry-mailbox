
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { google } from "https://esm.sh/googleapis@126.0.1";
import { decode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handles CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
}

// Main function to serve HTTP requests
serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { accountId } = await req.json();
    
    if (!accountId) {
      return new Response(
        JSON.stringify({ success: false, error: "Account ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Starting sync for email account: ${accountId}`);
    
    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Get the email account details including oauth tokens
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
          error: "Email account not found",
          details: accountError
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      Deno.env.get("GOOGLE_CLIENT_ID"),
      Deno.env.get("GOOGLE_CLIENT_SECRET"),
      Deno.env.get("GOOGLE_REDIRECT_URL")
    );
    
    // Set credentials from database
    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token
    });
    
    // Create Gmail client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    // Fetch the list of messages (newsletters)
    // Look for newsletters and promotional emails
    const messageResponse = await gmail.users.messages.list({
      userId: 'me',
      q: 'category:promotions OR category:updates',
      maxResults: 10 // Limit for testing, can be increased
    });
    
    if (!messageResponse.data.messages || messageResponse.data.messages.length === 0) {
      // Update last_sync time even if no messages found
      await supabaseAdmin
        .from("email_accounts")
        .update({ last_sync: new Date().toISOString() })
        .eq("id", accountId);
        
      return new Response(
        JSON.stringify({ 
          success: true, 
          synced: [],
          count: 0,
          message: "No newsletter emails found"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Array to collect processed newsletters
    const processedNewsletters = [];
    const failedNewsletters = [];
    
    // Process each message
    for (const message of messageResponse.data.messages) {
      try {
        // Get full message details
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });
        
        // Extract headers
        const headers = fullMessage.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || '';
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
        
        // Parse sender name and email
        let senderName = from;
        let senderEmail = '';
        
        const emailMatch = from.match(/<([^>]+)>/);
        if (emailMatch) {
          senderEmail = emailMatch[1];
          senderName = from.replace(/<[^>]+>/, '').trim();
        } else {
          senderEmail = from;
        }
        
        // Extract HTML content
        let htmlContent = '';
        
        // Function to find HTML part in message parts
        function findHtmlPart(parts) {
          if (!parts) return null;
          
          for (const part of parts) {
            if (part.mimeType === 'text/html' && part.body?.data) {
              return part.body.data;
            }
            
            if (part.parts) {
              const nestedHtml = findHtmlPart(part.parts);
              if (nestedHtml) return nestedHtml;
            }
          }
          
          return null;
        }
        
        // Look for HTML content in parts
        if (fullMessage.data.payload?.parts) {
          const htmlData = findHtmlPart(fullMessage.data.payload.parts);
          if (htmlData) {
            htmlContent = new TextDecoder().decode(decode(htmlData));
          }
        } else if (fullMessage.data.payload?.body?.data) {
          // If no parts, try to get content from body
          htmlContent = new TextDecoder().decode(decode(fullMessage.data.payload.body.data));
        }
        
        // Create preview text from HTML (simple strip of HTML tags)
        const previewText = htmlContent
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 200) + '...';
        
        // Convert date string to ISO format for database
        let publishedDate;
        try {
          publishedDate = new Date(date).toISOString();
        } catch (e) {
          publishedDate = new Date().toISOString();
        }
        
        // Insert newsletter into database
        const { data: insertedNewsletter, error: insertError } = await supabaseAdmin
          .from("newsletters")
          .insert({
            title: subject,
            sender: senderName,
            sender_email: senderEmail,
            preview: previewText,
            content: htmlContent,
            published_at: publishedDate,
            email_id: accountId,
            industry: 'Newsletter' // Default category
          })
          .select()
          .single();
        
        if (insertError) {
          console.error(`Error inserting newsletter "${subject}":`, insertError);
          failedNewsletters.push({
            title: subject,
            error: insertError.message
          });
          continue;
        }
        
        processedNewsletters.push({
          id: insertedNewsletter.id,
          title: subject,
          sender: senderName
        });
        
      } catch (messageError) {
        console.error(`Error processing message ${message.id}:`, messageError);
        failedNewsletters.push({
          id: message.id,
          error: messageError.message
        });
      }
    }
    
    // Update last_sync time
    await supabaseAdmin
      .from("email_accounts")
      .update({ last_sync: new Date().toISOString() })
      .eq("id", accountId);
    
    // Determine if this was a partial success
    const isPartialSuccess = failedNewsletters.length > 0 && processedNewsletters.length > 0;
    
    return new Response(
      JSON.stringify({
        success: true,
        partial: isPartialSuccess,
        synced: processedNewsletters,
        failed: failedNewsletters,
        count: processedNewsletters.length,
        details: isPartialSuccess ? `Failed to sync ${failedNewsletters.length} newsletters` : null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error in sync-emails function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
        details: String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
