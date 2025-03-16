
import { corsHeaders } from '../../_shared/cors.ts';
import { SyncResponseData } from '../types.ts';

/**
 * Create a success response
 */
export function createSuccessResponse(data: Partial<SyncResponseData>): Response {
  return new Response(
    JSON.stringify({
      success: true,
      ...data
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

/**
 * Create an error response
 */
export function createErrorResponse(errorMessage: string, details: any = null): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
