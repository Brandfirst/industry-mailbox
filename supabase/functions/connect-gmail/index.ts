
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Get authorization code from request
  try {
    // Get the request body
    const reqData = await req.json()
    const { code, userId, redirectUri } = reqData

    console.log('Received request with:', {
      hasCode: !!code,
      codeLength: code?.length,
      userId,
      redirectUri: redirectUri || 'No redirect URI provided',
      timestamp: new Date().toISOString()
    })

    if (!code) {
      console.error('No code provided in request')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No authorization code provided',
          statusCode: 400
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!userId) {
      console.error('No userId provided in request')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'User ID is required',
          statusCode: 400
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!redirectUri) {
      console.error('No redirectUri provided in request')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Redirect URI is required',
          statusCode: 400
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Exchange the authorization code for tokens
    console.log('Exchanging code for tokens...')
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Error exchanging code for tokens:', errorData)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to exchange authorization code for tokens',
          details: errorData,
          googleError: errorData.error,
          googleErrorDescription: errorData.error_description,
          statusCode: tokenResponse.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tokenData = await tokenResponse.json()
    console.log('Successfully obtained tokens:', {
      hasAccessToken: !!tokenData.access_token,
      accessTokenLength: tokenData.access_token?.length,
      hasRefreshToken: !!tokenData.refresh_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in
    })

    // Get user info using the access token
    console.log('Fetching user profile from Google...')
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    )

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json()
      console.error('Error fetching user profile:', errorData)
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to fetch user profile from Google',
          details: errorData,
          googleError: errorData.error?.message || errorData.error,
          tokenInfo: {
            hasAccessToken: !!tokenData.access_token,
            tokenType: tokenData.token_type,
          },
          statusCode: userInfoResponse.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userInfo = await userInfoResponse.json()
    console.log('Successfully fetched user profile:', {
      hasEmail: !!userInfo.email,
      emailVerified: userInfo.verified_email,
      name: userInfo.name,
      picture: !!userInfo.picture
    })

    if (!userInfo.email) {
      console.error('Email not available in Google user data:', userInfo)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Could not retrieve email from Google account',
          details: 'Email permission may be missing',
          statusCode: 400
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Save the tokens in the database
    console.log('Saving email account to database...')
    
    // Check if this email account already exists for this user
    const { data: existingAccounts, error: checkError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('email', userInfo.email)
      
    if (checkError) {
      console.error('Error checking for existing account:', checkError)
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database error checking for existing account',
          details: checkError,
          statusCode: 500
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    let account
    
    if (existingAccounts && existingAccounts.length > 0) {
      // Update the existing account with new tokens
      console.log('Updating existing account for:', userInfo.email)
      
      const { data: updatedAccount, error: updateError } = await supabase
        .from('email_accounts')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || existingAccounts[0].refresh_token,
          is_connected: true,
        })
        .eq('id', existingAccounts[0].id)
        .select()
        .single()
        
      if (updateError) {
        console.error('Error updating existing account:', updateError)
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to update existing email account',
            details: updateError,
            statusCode: 500
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      account = updatedAccount
    } else {
      // Insert a new account
      console.log('Creating new account for:', userInfo.email)
      
      const { data: newAccount, error: insertError } = await supabase
        .from('email_accounts')
        .insert({
          user_id: userId,
          email: userInfo.email,
          provider: 'gmail',
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          is_connected: true,
        })
        .select()
        .single()
        
      if (insertError) {
        console.error('Error inserting new account:', insertError)
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to save email account',
            details: insertError,
            statusCode: 500
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      account = newAccount
    }

    console.log('Successfully saved account:', {
      id: account.id,
      email: account.email,
      provider: account.provider,
      timestamp: new Date().toISOString()
    })

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        account: {
          id: account.id,
          email: account.email,
          provider: account.provider,
          is_connected: account.is_connected,
        },
        statusCode: 200
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error in connect-gmail function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
        details: String(error),
        statusCode: 500
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
