
// Follow this setup guide to integrate the Deno runtime and the Supabase functions
// https://docs.supabase.com/guides/functions/getting-started
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Define standard CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function maskSensitiveInfo(headers) {
  const maskedHeaders = { ...headers };
  if (maskedHeaders.authorization) {
    maskedHeaders.authorization = "***REDACTED***";
  }
  if (maskedHeaders.apikey) {
    maskedHeaders.apikey = "***REDACTED***";
  }
  return maskedHeaders;
}

async function checkDatabaseConnection() {
  try {
    // Get the environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        success: false,
        error: "Missing Supabase environment variables",
        missingVars: {
          url: !supabaseUrl,
          key: !supabaseKey
        }
      };
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to query a simple table that should exist
    const { data, error, status } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (error) {
      return {
        success: false,
        error: `Database query error: ${error.message}`,
        details: error,
        status
      };
    }
    
    return {
      success: true,
      data: "Database connection successful",
      queryResult: data,
      status
    };
  } catch (err) {
    return {
      success: false,
      error: `Exception during database check: ${err.message}`,
      stack: err.stack
    };
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Debug test function invoked", new Date().toISOString());
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Capture request information for debugging
    const url = new URL(req.url);
    const headers = Object.fromEntries(req.headers);
    const maskedHeaders = maskSensitiveInfo(headers);
    const method = req.method;
    const timestamp = new Date().toISOString();
    
    // Get environment information
    const envVars = {
      supabaseUrl: Deno.env.has("SUPABASE_URL") ? "set" : "not-set",
      supabaseKey: Deno.env.has("SUPABASE_SERVICE_ROLE_KEY") ? "set" : "not-set",
      supabaseAnonKey: Deno.env.has("SUPABASE_ANON_KEY") ? "set" : "not-set",
      supabaseDbUrl: Deno.env.has("SUPABASE_DB_URL") ? "set" : "not-set",
      googleClientId: Deno.env.has("GOOGLE_CLIENT_ID") ? "set" : "not-set",
      googleClientSecret: Deno.env.has("GOOGLE_CLIENT_SECRET") ? "set" : "not-set",
      googleRedirectUrl: Deno.env.has("GOOGLE_REDIRECT_URL") ? "set" : "not-set",
    };
    
    // Get body if it exists
    let body = null;
    if (method !== "GET" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        body = await req.json();
      } catch (e) {
        console.log("Error parsing request body:", e);
      }
    }
    
    // Check database connection
    const dbCheck = await checkDatabaseConnection();
    
    // Compile response data
    const responseData = {
      message: "Debug test function executed successfully",
      timestamp,
      request: {
        url: url.toString(),
        path: url.pathname,
        search: url.search,
        method,
        headers: maskedHeaders
      },
      environment: envVars,
      database: dbCheck,
      body: body
    };
    
    // Log response data
    console.log("Debug response data:", JSON.stringify(responseData));
    
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in debug-test function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
