
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    // Get the request body
    const { accountId } = await req.json();

    if (!accountId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required parameter: accountId' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Log inputs for debugging
    console.log(`Processing sync request for accountId: ${accountId}`);

    // Get the email account
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError) {
      console.error('Error fetching email account:', accountError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch email account' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Update the last_sync timestamp
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId);

    if (updateError) {
      console.error('Error updating last_sync:', updateError);
    }

    // In a real implementation, you would use the tokens to fetch emails from Gmail
    // and process them to extract newsletters

    // For now, just return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sync process started. This may take some time to complete.' 
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Unexpected error during sync:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'An unexpected error occurred' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
