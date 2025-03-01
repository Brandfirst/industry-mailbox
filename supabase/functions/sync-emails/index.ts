
// Follow this setup guide to integrate the Deno runtime into your application:
// https://docs.deno.com/runtime/manual/getting_started/setup

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { accountId } = await req.json()
    
    if (!accountId) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Account ID is required'
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Using 200 even for errors to avoid client-side issues
      })
    }

    // Get account information
    const { data: account, error: accountError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', accountId)
      .single()

    if (accountError || !account) {
      console.error('Error fetching account:', accountError)
      return new Response(JSON.stringify({
        success: false,
        error: 'Email account not found',
        details: accountError?.message
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // For demo/testing purposes, we'll create some sample newsletters
    // In a real implementation, this would fetch from Gmail API
    const currentTime = new Date().toISOString()
    
    // Create sample newsletters with unique titles to avoid conflicts
    const sampleNewsletters = [
      {
        title: `Daily Tech News - ${currentTime}`,
        sender: "Tech Daily",
        sender_email: "news@techdaily.com",
        industry: "Technology",
        preview: "The latest in tech news and innovations",
        content: "<h1>Tech Daily</h1><p>Here are today's top tech stories...</p>",
        published_at: new Date().toISOString(),
        email_id: accountId
      },
      {
        title: `Weekly Finance Update - ${currentTime}`,
        sender: "Finance Weekly",
        sender_email: "updates@financeweekly.com",
        industry: "Finance",
        preview: "Your weekly financial news digest",
        content: "<h1>Finance Weekly</h1><p>Markets performed well this week...</p>",
        published_at: new Date().toISOString(),
        email_id: accountId
      }
    ]

    // Insert newsletters one by one instead of in batch to avoid conflicts
    const insertedNewsletters = []
    let errorOccurred = false
    let errorDetails = null
    
    for (const newsletter of sampleNewsletters) {
      try {
        // Check if a newsletter with this title and email_id already exists
        const { data: existingNewsletter } = await supabase
          .from('newsletters')
          .select('id')
          .eq('title', newsletter.title)
          .eq('email_id', newsletter.email_id)
          .maybeSingle()
        
        let result
        
        if (existingNewsletter) {
          // If it exists, update it
          const { data, error } = await supabase
            .from('newsletters')
            .update(newsletter)
            .eq('id', existingNewsletter.id)
            .select()
          
          result = { data, error }
        } else {
          // If it doesn't exist, insert it
          const { data, error } = await supabase
            .from('newsletters')
            .insert(newsletter)
            .select()
          
          result = { data, error }
        }
        
        if (result.error) {
          console.error('Error inserting/updating newsletter:', result.error)
          errorOccurred = true
          errorDetails = result.error
        } else if (result.data) {
          insertedNewsletters.push(result.data[0])
        }
      } catch (error) {
        console.error('Exception while processing newsletter:', error)
        errorOccurred = true
        errorDetails = error
      }
    }

    // Update the last_sync timestamp for the account
    const { error: updateError } = await supabase
      .from('email_accounts')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', accountId)

    if (updateError) {
      console.error('Error updating last_sync timestamp:', updateError)
    }

    // If any newsletters failed to insert, return a partial success
    if (errorOccurred) {
      return new Response(JSON.stringify({
        success: true,
        partial: true,
        count: insertedNewsletters.length,
        synced: insertedNewsletters,
        error: 'Some newsletters failed to sync',
        details: errorDetails
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      count: insertedNewsletters.length,
      synced: insertedNewsletters
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Unexpected error in sync-emails function:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: 'An unexpected error occurred during sync',
      details: error.message || String(error)
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 // Using 200 even for errors to avoid client-side issues
    })
  }
})
