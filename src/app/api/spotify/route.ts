import { NextResponse } from 'next/server'
import { ENV } from '@/lib/constants'

/**
 * Server-side API endpoint to fetch currently playing song from Spotify
 * Uses the Spotify Web API with refresh token flow
 */
export async function GET() {
  try {
    // Check for required environment variables
    if (!ENV.SPOTIFY_CLIENT_ID || !ENV.SPOTIFY_CLIENT_SECRET || !ENV.SPOTIFY_REFRESH_TOKEN) {
      return NextResponse.json(
        {
          isPlaying: false,
          error: 'Spotify credentials are not configured'
        },
        { status: 200 }
      )
    }

    // Get access token using refresh token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${ENV.SPOTIFY_CLIENT_ID}:${ENV.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: ENV.SPOTIFY_REFRESH_TOKEN
      })
    })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get access token: ${tokenResponse.status}`)
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get currently playing track
    const nowPlayingResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      next: { revalidate: 30 } // Cache for 30 seconds
    })

    // No content means not playing
    if (nowPlayingResponse.status === 204) {
      return NextResponse.json({
        isPlaying: false
      })
    }

    if (!nowPlayingResponse.ok) {
      throw new Error(`Failed to get currently playing track: ${nowPlayingResponse.status}`)
    }

    const nowPlayingData = await nowPlayingResponse.json()

    // If nothing is playing
    if (!nowPlayingData.is_playing) {
      return NextResponse.json({
        isPlaying: false
      })
    }

    // Extract relevant data from response
    const songName = nowPlayingData.item.name
    const artistName = nowPlayingData.item.artists.map((artist: any) => artist.name).join(', ')
    const albumName = nowPlayingData.item.album.name
    const albumImageUrl = nowPlayingData.item.album.images[0]?.url || null
    const songUrl = nowPlayingData.item.external_urls.spotify
    const progressMs = nowPlayingData.progress_ms
    const durationMs = nowPlayingData.item.duration_ms

    return NextResponse.json({
      isPlaying: true,
      songName,
      artistName,
      albumName,
      albumImageUrl,
      songUrl,
      progressMs,
      durationMs
    })
  } catch (error) {
    console.error('Error fetching Spotify data:', error)
    return NextResponse.json(
      {
        isPlaying: false,
        error: 'Failed to fetch data from Spotify'
      },
      { status: 200 }
    )
  }
}
