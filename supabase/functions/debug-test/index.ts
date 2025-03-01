
// Follow this setup guide to integrate the Deno runtime and Supabase functions
// https://supabase.com/docs/guides/functions/getting-started

import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Debug Test Function started");

function getEnvironmentInfo() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_KEY");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseDbUrl = Deno.env.get("SUPABASE_DB_URL");
  
  // Extract the project reference from the URL if possible
  let projectRef = "unknown";
  if (supabaseUrl) {
    try {
      const url = new URL(supabaseUrl);
      const hostParts = url.hostname.split('.');
      if (hostParts.length > 0) {
        projectRef = hostParts[0];
      }
    } catch (e) {
      console.error("Error parsing Supabase URL:", e);
    }
  }
  
  // Return environment information without exposing actual values
  return {
    environment: Deno.env.get("ENVIRONMENT") || "production",
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    hasServiceRoleKey: !!supabaseServiceRoleKey,
    hasDbUrl: !!supabaseDbUrl,
    projectRef: projectRef,
    denoVersion: Deno.version.deno,
    v8Version: Deno.version.v8,
    tsVersion: Deno.version.typescript
  };
}

serve(async (req) => {
  // Log request details
  console.log(`Debug Test Function received ${req.method} request at ${new Date().toISOString()}`);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }
  
  // Log environment variables (without sensitive values)
  console.log("Environment check:", getEnvironmentInfo());
  
  try {
    // Parse request body
    const requestBody = await req.json();
    console.log("Request payload:", JSON.stringify(requestBody, null, 2));
    
    // Create response with debug information
    const responseData = {
      success: true,
      message: "Debug function executed successfully",
      debug: {
        requestTimestamp: requestBody.timestamp || new Date().toISOString(),
        timestamp: new Date().toISOString(),
        ...getEnvironmentInfo(),
        requestHeaders: Object.fromEntries([...req.headers.entries()].map(([key, value]) => 
          // Mask authorization headers
          key.toLowerCase() === 'authorization' ? [key, "****"] : [key, value]
        )),
        url: req.url,
        method: req.method
      },
      requestBody: requestBody
    };
    
    console.log("Debug function completed successfully");
    
    // Return the response
    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in debug-test function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || String(error),
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        },
        status: 500 
      }
    );
  }
});
