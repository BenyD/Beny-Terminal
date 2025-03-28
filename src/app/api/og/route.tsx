import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

import { ENV } from '@/lib/constants'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const postTitle = searchParams.get('title')

  // Load Inter font
  const interRegular = await fetch(new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap')).then(res => res.arrayBuffer())

  const interBold = await fetch(new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap')).then(res => res.arrayBuffer())

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
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'normal',
            fontWeight: '700',
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
      height: 620,
      fonts: [
        {
          name: 'Inter',
          data: interRegular,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700
        }
      ]
    }
  )
}
