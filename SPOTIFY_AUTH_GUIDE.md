# Getting Your Spotify Refresh Token

This guide explains how to obtain a Spotify refresh token for the Now Playing integration.

## Prerequisites

1. Create a Spotify Developer account at https://developer.spotify.com/dashboard/

## Step 1: Create a Spotify Application

1. Log in to your Spotify Developer Dashboard
2. Click "Create App"
3. Fill in the required information:
   - App name: "Your Website Name"
   - App description: "Personal website integration"
   - Redirect URI: `http://localhost:3000/callback`
   - Website: Your website URL
4. Check the agreement checkbox and click "Create"

## Step 2: Get Your Client ID and Secret

1. After creating the app, you'll be redirected to the app dashboard
2. Note down your Client ID (visible on the dashboard)
3. Click "Show Client Secret" and note that down as well
4. Add both to your `.env.local` file:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   ```

## Step 3: Generate an Authorization Code

1. Create the following URL, replacing `YOUR_CLIENT_ID` with your actual client ID:

   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing
   ```

2. Open this URL in your browser
3. Log in to your Spotify account if prompted
4. Authorize the application
5. You'll be redirected to a URL that looks like:
   ```
   http://localhost:3000/callback?code=AQA...
   ```
6. Copy the entire code value after `?code=` (it's quite long)

## Step 4: Exchange the Authorization Code for a Refresh Token

Run this command in your terminal, replacing the placeholders:

```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Authorization: Basic BASE64_ENCODED_CREDENTIALS" -d "grant_type=authorization_code&code=AUTHORIZATION_CODE&redirect_uri=http://localhost:3000/callback" https://accounts.spotify.com/api/token
```

Where:

- `BASE64_ENCODED_CREDENTIALS` is the base64-encoded string of `your_client_id:your_client_secret`
  - You can generate this by running: `echo -n 'your_client_id:your_client_secret' | base64`
- `AUTHORIZATION_CODE` is the code from Step 3

This will return a JSON response containing your refresh token.

## Step 5: Add the Refresh Token to Your Environment Variables

Add the refresh token to your `.env.local` file:

```
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

## Automated Method (Alternative)

If you prefer an easier way, you can use a tool like [spotify-refresh-token](https://spotify-refresh-token.netlify.app/) to generate a refresh token more easily.

1. Visit [spotify-refresh-token](https://spotify-refresh-token.netlify.app/)
2. Enter your Client ID and Client Secret
3. Set the redirect URI to `http://localhost:3000/callback`
4. Set the scopes to `user-read-currently-playing`
5. Click "Generate Token"
6. Follow the prompts to authorize the application
7. Copy the refresh token from the result
