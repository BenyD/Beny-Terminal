import { NextRequest, NextResponse } from 'next/server'

// You should get your own API key from https://openweathermap.org/api
// and add it to your .env.local file as OPENWEATHER_API_KEY
const API_KEY = process.env.OPENWEATHER_API_KEY || ''

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get('location')

  if (!location) {
    return NextResponse.json({ error: 'Location parameter is required' }, { status: 400 })
  }

  if (!API_KEY) {
    return NextResponse.json(
      {
        error: 'Weather API key not configured',
        weather: {
          location: location,
          temperature: 21,
          condition: 'Sunny',
          humidity: 45,
          wind: 5.2,
          description: 'Sample weather data (API key not configured)'
        }
      },
      { status: 200 }
    )
  }

  try {
    // Fetch weather data from OpenWeatherMap
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`, { cache: 'no-store' })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.message || 'Failed to fetch weather data' }, { status: response.status })
    }

    const data = await response.json()

    const weather = {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    }

    return NextResponse.json({ weather }, { status: 200 })
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
