
import { corsHeaders } from '../../_shared/cors.ts';
import { SyncResponseData } from '../types.ts';

/**
 * Create a success response
 * @param data The data to include in the response
 * @returns A formatted success Response object
 */
export function createSuccessResponse(data: Partial<SyncResponseData>): Response {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        ...data,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error creating success response:', error);
    // Fallback to a basic response if JSON serialization fails
    return new Response(
      JSON.stringify({ 
        success: true, 
        error: 'Error formatting response data',
        timestamp: new Date().toISOString() 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
}

/**
 * Create an error response
 * @param errorMessage The main error message
 * @param details Additional error details (optional)
 * @param statusCode HTTP status code (defaults to 400)
 * @returns A formatted error Response object
 */
export function createErrorResponse(
  errorMessage: string, 
  details: any = null, 
  statusCode: number = 400
): Response {
  try {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: details,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode
      }
    );
  } catch (error) {
    console.error('Error creating error response:', error);
    // Fallback to a basic error response if JSON serialization fails
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error while formatting error response',
        originalError: String(errorMessage),
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

/**
 * Safely handle unexpected errors in the Edge Function
 * @param error The error object
 * @returns A formatted error Response object
 */
export function handleUnexpectedError(error: any): Response {
  console.error('Unexpected error in Edge Function:', error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string'
      ? error
      : 'Unknown error';
      
  const errorDetails = error instanceof Error 
    ? { name: error.name, stack: error.stack }
    : { originalError: String(error) };
    
  return createErrorResponse(
    `Edge Function error: ${errorMessage}`,
    errorDetails,
    500
  );
}

/**
 * Create a partial success response when some operations succeeded but others failed
 */
export function createPartialSuccessResponse(
  successData: any, 
  failedData: any, 
  warningMessage: string = 'Operation partially succeeded'
): Response {
  return createSuccessResponse({
    partial: true,
    ...successData,
    failed: failedData,
    warning: warningMessage
  });
}
