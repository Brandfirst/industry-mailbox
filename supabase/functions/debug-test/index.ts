
import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log that we received a request
    console.log("Debug test function called!");
    
    // Parse the request body
    const requestData = await req.json();
    console.log("Request data:", requestData);
    
    // Generate some debug info
    const debugInfo = {
      timestamp: new Date().toISOString(),
      requestTimestamp: requestData.timestamp,
      environment: Deno.env.get("ENVIRONMENT") || "unknown",
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasSupabaseKey: !!Deno.env.get("SUPABASE_ANON_KEY"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    };
    
    console.log("Debug info:", debugInfo);
    
    // Return a successful response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Debug test function executed successfully!",
        debug: debugInfo
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 200 
      }
    );
  } catch (error) {
    // Log the error
    console.error("Error in debug test function:", error);
    
    // Return an error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        },
        status: 500 
      }
    );
  }
});
