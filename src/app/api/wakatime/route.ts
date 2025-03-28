import { NextResponse } from 'next/server'

/**
 * Server-side API proxy for WakaTime embeddable JSON endpoints.
 *
 * This prevents CORS issues when fetching from client-side and keeps our API key secure.
 * Based on WakaTime API docs: https://wakatime.com/developers
 *
 * WakaTime embeddable charts and JSON are available at:
 * https://wakatime.com/share/embed
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  try {
    // WakaTime embeddable endpoints support both JSON and JSONP
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching WakaTime data:', error)
    return NextResponse.json({ error: 'Failed to fetch data from WakaTime' }, { status: 500 })
  }
}
