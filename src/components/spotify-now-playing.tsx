'use client'

import { useState, useEffect } from 'react'

interface SpotifyData {
  isPlaying: boolean
  songName?: string
  artistName?: string
  albumName?: string
  albumImageUrl?: string | null
  songUrl?: string
  progressMs?: number
  durationMs?: number
  error?: string
}

export function SpotifyNowPlaying() {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSpotifyData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/spotify', { cache: 'no-store' })
      const data = await response.json()
      setSpotifyData(data)
    } catch (error) {
      console.error('Error fetching Spotify data:', error)
      setSpotifyData({ isPlaying: false, error: 'Failed to load' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSpotifyData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchSpotifyData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Loading state
  if (isLoading && !spotifyData) {
    return (
      <div className='flex items-center gap-2'>
        <svg className='h-3 w-3 animate-spin text-[#969696]' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          ></path>
        </svg>
        <span className='text-[#969696] text-xs'>Loading Spotify...</span>
      </div>
    )
  }

  // Not playing or error - return null to hide the component
  if (!spotifyData?.isPlaying) {
    return null
  }

  // Display currently playing
  return (
    <a href={spotifyData.songUrl} target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
      <svg className='h-3 w-3 text-green-500 animate-pulse' viewBox='0 0 24 24' fill='currentColor'>
        <path
          d='M12 2a10 10 0 100 20 10 10 0 000-20zm4.586 14.657a.623.623 0 01-.857.208c-2.348-1.435-5.304-1.76-8.786-.964a.624.624
        0 01-.277-1.216c3.808-.87 7.076-.495 9.712 1.115a.623.623 0 01.208.857zm1.223-2.722a.78.78 0 01-1.072.26c-2.687-1.653-6.786-2.13-9.965-1.166a.78.78
        0 01-.453-1.493c3.631-1.102 8.147-.569 11.232 1.327a.779.779 0 01.258 1.072zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935
        0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 11-.954 1.608z'
        />
      </svg>
      <span className='text-green-500 text-xs truncate max-w-[150px]'>
        {spotifyData.songName} - {spotifyData.artistName}
      </span>
    </a>
  )
}
