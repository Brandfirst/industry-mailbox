
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DisconnectNotificationRequest {
  accountId: string;
  email?: string;
  userId?: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { accountId, email, userId, timestamp } = await req.json() as DisconnectNotificationRequest;
    
    console.log(`Email account disconnected: ${email || "unknown"} (ID: ${accountId}) for user ${userId || "unknown"} at ${timestamp}`);
    
    // This function only logs the disconnection event
    // You could expand it to perform additional cleanup if needed
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Disconnection event logged successfully",
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error in disconnect-notification handler:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An error occurred processing the disconnection notification",
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
