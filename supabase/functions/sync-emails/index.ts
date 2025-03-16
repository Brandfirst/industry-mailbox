
import { corsHeaders } from '../_shared/cors.ts';
import { handleSyncRequest } from './handlers/requestHandler.ts';
import { handleUnexpectedError } from './handlers/responseHandler.ts';

// Handle incoming requests
Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Handle sync request
    return await handleSyncRequest(req);
  } catch (error) {
    // Handle unexpected errors
    return handleUnexpectedError(error);
  }
});
