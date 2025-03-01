
// @ts-ignore
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
    // Log that we received a request with multiple console logs to make it very visible
    console.log("==================================================");
    console.log("DEBUG TEST FUNCTION CALLED! THIS SHOULD BE VISIBLE IN LOGS!");
    console.log("==================================================");
    
    // Parse the request body
    const requestData = await req.json();
    console.log("Request data received:", JSON.stringify(requestData));
    
    // Generate some debug info
    const debugInfo = {
      timestamp: new Date().toISOString(),
      requestTimestamp: requestData.timestamp,
      environment: Deno.env.get("ENVIRONMENT") || "unknown",
      hasSupabaseUrl: !!Deno.env.get("SUPABASE_URL"),
      hasSupabaseKey: !!Deno.env.get("SUPABASE_ANON_KEY"),
      hasServiceRoleKey: !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      requestHeaders: Object.fromEntries(
        [...req.headers.entries()].filter(([key]) => 
          !['authorization', 'apikey'].includes(key.toLowerCase())
        )
      ),
      denoVersion: Deno.version.deno,
      typescriptVersion: Deno.version.typescript,
      v8Version: Deno.version.v8,
    };
    
    console.log("Debug info generated:", JSON.stringify(debugInfo, null, 2));
    
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
    console.error("ERROR in debug test function:", error);
    
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
