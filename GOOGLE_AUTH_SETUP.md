# Google Authentication Setup Guide

## Overview

Your application now supports Google OAuth authentication. Users can sign in using their Google accounts in addition to email/password authentication.

## Setting Up Google OAuth in Supabase

To enable Google authentication, follow these steps:

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure the consent screen if prompted:
   - Choose **External** user type
   - Fill in required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: `JUSTICE Platform` (or any name)
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - Your production URL (when deployed)
   - Authorized redirect URIs:
     - `https://vttsevzjadobuaeeijhy.supabase.co/auth/v1/callback`

7. Click **Create** and save your:
   - **Client ID**
   - **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/project/vttsevzjadobuaeeijhy)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list of providers
4. Enable Google provider
5. Enter your credentials:
   - **Client ID**: (from Step 1)
   - **Client Secret**: (from Step 1)
6. Click **Save**

### Step 3: Test Google Authentication

1. Start your development server (already running)
2. Go to the login page
3. Click **Continue with Google**
4. Sign in with your Google account
5. You'll be redirected back to the application

## How It Works

### User Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. User approves access
4. Google redirects back to Supabase
5. Supabase creates/updates user account
6. User profile is automatically created if it doesn't exist
7. User is logged into the application

### Profile Creation

When a user signs in with Google for the first time:
- A profile is automatically created
- Username is derived from email (before @)
- Full name is taken from Google profile metadata
- User can update their profile later

## Security Features

- OAuth 2.0 secure authentication flow
- No password storage required
- Profile data protected by Row Level Security (RLS)
- Automatic session management
- Secure token handling

## Important Notes

1. **Redirect URI**: The redirect URI must match exactly what's configured in Google Cloud Console
2. **Email Verification**: Google accounts are pre-verified
3. **Profile Auto-Creation**: Profiles are created automatically on first sign-in
4. **Existing Users**: Users with same email can link accounts

## Troubleshooting

### "Redirect URI mismatch" error
- Check that redirect URI in Google Console matches Supabase callback URL
- Format: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### User not redirected after sign in
- Check browser console for errors
- Verify Google provider is enabled in Supabase
- Check that Client ID and Secret are correct

### Profile not created
- Check Supabase logs in Dashboard > Logs
- Verify RLS policies allow profile creation
- Check browser console for errors

## Production Deployment

When deploying to production:

1. Add your production URL to Google Console:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Keep the same redirect URI (Supabase callback)

2. Update your environment variables if needed

3. Test the flow on production

## Additional Features

You can extend Google authentication with:
- Profile photo from Google
- Additional user metadata
- Google Calendar integration
- Google Drive integration

All user data is protected by the existing RLS policies in your database.
