
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts';
import { handleSyncRequest } from './handlers/requestHandler.ts';
import { handleUnexpectedError } from './handlers/responseHandler.ts';

// Main request handler
serve(async (req) => {
  // Add specific CORS headers for browser compatibility
  const baseHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: baseHeaders 
    });
  }
  
  // Process the request with enhanced error handling
  try {
    // Add a try/catch inside the main try block to catch any errors in the handler
    try {
      return await handleSyncRequest(req);
    } catch (handlerError) {
      console.error('Error in request handler:', handlerError);
      return handleUnexpectedError(handlerError);
    }
  } catch (error) {
    // This is a last resort error handler if something goes very wrong
    console.error('Critical error in Edge Function:', error);
    
    // Ensure we return a valid response even in catastrophic failure
    try {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Critical server error occurred',
          errorDetails: String(error),
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500,
          headers: baseHeaders
        }
      );
    } catch (responseError) {
      // Ultimate fallback if JSON stringification fails
      return new Response(
        'Critical server error', 
        { 
          status: 500,
          headers: baseHeaders
        }
      );
    }
  }
})
