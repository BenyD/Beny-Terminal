import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { ENV } from '@/lib/constants'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const postTitle = searchParams.get('title')

  try {
    // Simple approach without loading external fonts
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
            backgroundImage: `url(${ENV.NEXT_PUBLIC_WEBSITE_URL}/og-bg.png)`
          }}
        >
          <p
            style={{
              marginLeft: 205,
              marginRight: 205,
              display: 'flex',
              fontSize: 68,
              lineHeight: 0.9,
              fontFamily: 'sans-serif', // Using system fonts instead
              fontStyle: 'normal',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#C6C6C6'
            }}
          >
            {postTitle}
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 620
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Error generating image', { status: 500 })
  }
}
