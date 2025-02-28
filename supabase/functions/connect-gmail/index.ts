import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || ''
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || ''
const GOOGLE_REDIRECT_URL = Deno.env.get('GOOGLE_REDIRECT_URL') || ''

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  console.log(`Exchanging code for tokens with redirect URI: ${redirectUri}`)
  
  try {
    // Use the authorization code to get tokens
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

    const tokenData = await tokenResponse.json()

    // Log the token response for debugging (consider removing sensitive info in production)
    console.log('Token response status:', tokenResponse.status)
    
    // Check if the token request failed
    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for tokens:', tokenData)
      return {
        success: false,
        error: 'Failed to exchange authorization code for tokens',
        googleError: tokenData.error,
        googleErrorDescription: tokenData.error_description,
        status: tokenResponse.status
      }
    }
    
    // Log a success message (without the actual tokens)
    console.log('Successfully exchanged code for tokens, got access_token, refresh_token, and token_type')
    
    return {
      success: true,
      tokens: tokenData
    }
  } catch (error) {
    console.error('Exception during token exchange:', error)
    return {
      success: false,
      error: 'Exception during token exchange',
      details: error.message || String(error)
    }
  }
}

async function getUserInfo(accessToken: string) {
  console.log('Getting user info with access token')
  
  try {
    // Use the access token to get user information
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    // Check if the user info request failed
    if (!userInfoResponse.ok) {
      console.error('Failed to get user info, status:', userInfoResponse.status)
      
      // Try to get the error message body
      let errorBody
      try {
        errorBody = await userInfoResponse.json()
      } catch (e) {
        errorBody = await userInfoResponse.text()
      }
      
      console.error('Error getting user info:', errorBody)
      
      return {
        success: false,
        error: 'Failed to get user information',
        details: errorBody,
        status: userInfoResponse.status
      }
    }

    const userInfo = await userInfoResponse.json()
    console.log('Successfully got user info for email:', userInfo.email)
    
    return {
      success: true,
      userInfo
    }
  } catch (error) {
    console.error('Exception during user info fetch:', error)
    return {
      success: false,
      error: 'Exception during user info fetch',
      details: error.message || String(error)
    }
  }
}

async function saveEmailAccount(supabase, userId: string, email: string, tokens: any) {
  console.log(`Saving email account for user ${userId} with email ${email}`)
  
  try {
    // Check if an account with this email already exists for the user
    const { data: existingAccounts, error: queryError } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('email', email)
    
    if (queryError) {
      console.error('Error checking for existing account:', queryError)
      return {
        success: false,
        error: 'Failed to check for existing account',
        details: queryError
      }
    }
    
    // If the account already exists, update it
    if (existingAccounts && existingAccounts.length > 0) {
      const accountId = existingAccounts[0].id
      console.log(`Found existing account ${accountId}, updating tokens`)
      
      const { data, error: updateError } = await supabase
        .from('email_accounts')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          is_connected: true,
          token_type: tokens.token_type,
          expires_in: tokens.expires_in,
          scope: tokens.scope
        })
        .eq('id', accountId)
        .select()
        .single()
      
      if (updateError) {
        console.error('Error updating existing account:', updateError)
        return {
          success: false,
          error: 'Failed to update existing account',
          details: updateError
        }
      }
      
      console.log('Successfully updated existing email account')
      return {
        success: true,
        account: data
      }
    }
    
    // Otherwise, create a new account
    console.log('Creating new email account')
    const { data: newAccount, error: insertError } = await supabase
      .from('email_accounts')
      .insert({
        user_id: userId,
        email: email,
        provider: 'google',
        is_connected: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
        scope: tokens.scope
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error creating new account:', insertError)
      return {
        success: false,
        error: 'Failed to create new account',
        details: insertError
      }
    }
    
    console.log('Successfully created new email account')
    return {
      success: true,
      account: newAccount
    }
  } catch (error) {
    console.error('Exception during account save:', error)
    return {
      success: false,
      error: 'Exception during account save',
      details: error.message || String(error)
    }
  }
}

async function verifyToken(accessToken: string) {
  console.log('Verifying token validity')
  
  try {
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`
    )
    
    const tokenInfo = await tokenInfoResponse.json()
    
    if (!tokenInfoResponse.ok) {
      console.error('Token verification failed:', tokenInfo)
      return {
        success: false,
        error: 'Token verification failed',
        details: tokenInfo
      }
    }
    
    console.log('Token verified successfully')
    return {
      success: true,
      tokenInfo
    }
  } catch (error) {
    console.error('Exception during token verification:', error)
    return {
      success: false,
      error: 'Exception during token verification',
      details: error.message || String(error)
    }
  }
}

serve(async (req) => {
  console.log('Edge function called:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  // Process only POST requests
  if (req.method !== 'POST') {
    console.log('Invalid method, only POST is allowed')
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    })
  }

  try {
    const { code, userId, redirectUri } = await req.json()

    // Check required parameters
    if (!code || !userId) {
      console.error('Missing required parameters:', { code: !!code, userId: !!userId })
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters',
          details: { code: !!code, userId: !!userId }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Check environment variables
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      console.error('Missing environment variables:',  { 
        clientId: !!GOOGLE_CLIENT_ID, 
        clientSecret: !!GOOGLE_CLIENT_SECRET
      })
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Server configuration error: Missing required credentials',
          details: { 
            clientId: !!GOOGLE_CLIENT_ID, 
            clientSecret: !!GOOGLE_CLIENT_SECRET,
            redirectUrlVar: !!GOOGLE_REDIRECT_URL,
            providedRedirect: redirectUri 
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Exchange the code for tokens
    console.log('Exchanging code for tokens')
    const tokensResult = await exchangeCodeForTokens(code, redirectUri)
    
    if (!tokensResult.success) {
      console.error('Token exchange failed:', tokensResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: tokensResult.error,
          googleError: tokensResult.googleError,
          googleErrorDescription: tokensResult.googleErrorDescription,
          status: tokensResult.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    const tokens = tokensResult.tokens
    
    // Verify the token
    const verifyResult = await verifyToken(tokens.access_token)
    if (!verifyResult.success) {
      console.error('Token verification failed:', verifyResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to verify access token',
          details: verifyResult.details,
          tokenInfo: verifyResult.details
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get user info
    console.log('Getting user info')
    const userInfoResult = await getUserInfo(tokens.access_token)
    
    if (!userInfoResult.success) {
      console.error('User info fetch failed:', userInfoResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to get user information',
          details: userInfoResult.details,
          status: userInfoResult.status,
          tokenInfo: verifyResult.tokenInfo
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    const userInfo = userInfoResult.userInfo
    
    // Save the email account
    console.log('Saving email account')
    const saveResult = await saveEmailAccount(supabase, userId, userInfo.email, tokens)
    
    if (!saveResult.success) {
      console.error('Account save failed:', saveResult)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save email account',
          details: saveResult.details
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Return success response
    console.log('Successfully connected Gmail account:', userInfo.email)
    return new Response(
      JSON.stringify({ 
        success: true, 
        account: saveResult.account,
        message: 'Successfully connected Gmail account',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unhandled exception in Edge Function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error.message || String(error)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/connect-gmail' \
// --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// --header 'Content-Type: application/json' \
// --data '{"code":"AUTHORIZATION_CODE","userId":"USER_ID"}'
