
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.13.0'

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Safely mask sensitive values in headers or env vars
const maskSensitiveValue = (value: string): string => {
  if (!value) return '(empty)';
  if (value.length > 20) {
    return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
  }
  return '(value present but masked)';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  // Start our debug data collection
  console.log('Debug test function called');
  
  const debugData: Record<string, any> = {
    timestamp: new Date().toISOString(),
    function: 'debug-test',
    environment: Deno.env.get('ENVIRONMENT') || 'unknown',
    requestInfo: {
      method: req.method,
      url: req.url,
    },
    supabaseInfo: {
      supabaseUrlSet: !!Deno.env.get('SUPABASE_URL'),
      supabaseKeySet: !!Deno.env.get('SUPABASE_KEY'),
      serviceRoleKeySet: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      dbUrlSet: !!Deno.env.get('SUPABASE_DB_URL')
    },
    otherEnvVars: {},
    denoVersion: Deno.version.deno,
    v8Version: Deno.version.v8,
    typescriptVersion: Deno.version.typescript,
  };

  // Get filtered request headers (excluding sensitive values)
  const requestHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    // Mask authorization headers, api keys, etc.
    if (key.toLowerCase().includes('auth') || 
        key.toLowerCase().includes('key') || 
        key.toLowerCase().includes('token') || 
        key.toLowerCase().includes('secret')) {
      requestHeaders[key] = maskSensitiveValue(value);
    } else {
      requestHeaders[key] = value;
    }
  });
  debugData.requestHeaders = requestHeaders;

  // Add other relevant environment variables (masked if needed)
  for (const envVar of Deno.env.keys()) {
    if (!envVar.includes('KEY') && 
        !envVar.includes('SECRET') && 
        !envVar.includes('TOKEN') && 
        !envVar.includes('PASSWORD')) {
      debugData.otherEnvVars[envVar] = Deno.env.get(envVar);
    } else {
      debugData.otherEnvVars[envVar] = maskSensitiveValue(Deno.env.get(envVar) || '');
    }
  }

  // Check if we need to attempt a database test
  let dbResult = null;
  const url = new URL(req.url);
  const testDatabase = url.searchParams.get('testDatabase') === 'true';
  
  if (testDatabase) {
    try {
      console.log('Testing database connection...');
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      }
      
      // Create Supabase client
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Start timer for query
      const startTime = Date.now();
      
      // Perform a simple query to test database connection
      const { data, error, status } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      const duration = Date.now() - startTime;
      
      dbResult = {
        success: !error,
        duration: `${duration}ms`,
        status,
        error: error ? { 
          message: error.message, 
          code: error.code,
          details: error.details
        } : null,
        data: '(data masked for privacy)'
      };
      
      console.log('Database test completed:', dbResult.success ? 'SUCCESS' : 'FAILED');
    } catch (e) {
      console.error('Error testing database:', e);
      dbResult = {
        success: false,
        error: {
          message: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : undefined
        }
      };
    }
    
    debugData.databaseTest = dbResult;
  }

  // Get project reference 
  try {
    const project = Deno.env.get('SUPABASE_PROJECT_REF') || '(unknown)';
    debugData.projectRef = project;
  } catch (error) {
    debugData.projectRefError = String(error);
  }

  // Add test result message
  debugData.message = testDatabase 
    ? `Debug test completed with database test: ${dbResult?.success ? 'SUCCESS' : 'FAILED'}`
    : 'Debug test completed without database test';

  // Return the debug data as JSON
  return new Response(JSON.stringify(debugData, null, 2), {
    headers: { 
      ...corsHeaders,
      'Content-Type': 'application/json' 
    },
  })
})
