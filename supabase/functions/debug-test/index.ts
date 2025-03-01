
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body and log it
    let body;
    try {
      body = await req.json();
      console.log("Debug request body:", body);
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      body = { error: "Invalid JSON in request body" };
    }

    // Get request information
    const url = new URL(req.url);
    const requestInfo = {
      method: req.method,
      url: url.toString(),
      pathname: url.pathname,
      headers: Object.fromEntries(req.headers.entries()),
    };
    
    console.log("Request information:", requestInfo);

    // Check Supabase environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const projectRef = Deno.env.get("SUPABASE_PROJECT_REF") || url.hostname.split('.')[0];

    // Log detailed environment information
    console.log("Function environment:", {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasServiceRoleKey: !!supabaseServiceRoleKey,
      projectRef,
      denoVersion: Deno.version.deno,
      tsVersion: Deno.version.typescript,
      v8Version: Deno.version.v8,
    });

    // Check for any JWT token and log info about it (without sensitive parts)
    const authHeader = req.headers.get("authorization");
    let authInfo = { present: false };
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        // Just log that we have a token and its length, not the actual token
        authInfo = {
          present: true,
          length: token.length,
          format: token.split(".").length === 3 ? "valid JWT format" : "invalid JWT format",
        };
      } catch (e) {
        authInfo = { present: true, error: e.message };
      }
    }
    
    console.log("Authorization info:", authInfo);

    // Return a successful response with debug information
    return new Response(
      JSON.stringify({
        success: true,
        message: "Debug function executed successfully",
        timestamp: new Date().toISOString(),
        debug: {
          environment: Deno.env.get("ENVIRONMENT") || "development",
          requestTimestamp: body?.timestamp || "not provided",
          timestamp: new Date().toISOString(),
          hasSupabaseUrl: !!supabaseUrl,
          hasSupabaseKey: !!supabaseKey,
          hasServiceRoleKey: !!supabaseServiceRoleKey,
          projectRef,
          requestDetails: {
            method: req.method,
            path: url.pathname,
            host: url.host,
            search: url.search,
          },
          authStatus: authInfo,
          clientInfo: body?.clientInfo || "none provided",
        },
        requestBody: body,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    // Log and return any errors
    console.error("Debug function error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
