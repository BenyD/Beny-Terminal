import './globals.css'
import { Metadata } from 'next'
import Script from 'next/script'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { Navbar } from '@/components/navbar'
import { Container } from '@/components/container'
import { ResponsiveIndicator } from '@/components/responsive-indicator'

import { ENV } from '@/lib/constants'
import { Particles } from '@/components/particles'

export const metadata: Metadata = {
  metadataBase: new URL(ENV.NEXT_PUBLIC_WEBSITE_URL),
  title: {
    default: 'Beny Dishon K',
    template: '%s | Beny Dishon K'
  },
  description:
    "Get to know me, Beny Dishon K, through this website! I'm a passionate frontend developer and computer science engineering student, and I've poured my skills and creativity into building this site with Next.js and Tailwind CSS. Explore my interactive projects, clean portfolio, and a glimpse into my technical expertise. If you're seeking a talented developer for your next project or simply looking for inspiration, feel free to get in touch!",
  openGraph: {
    title: 'Beny Dishon K',
    description:
      "Get to know me, Beny Dishon K, through this website! I'm a passionate frontend developer and computer science engineering student, and I've poured my skills and creativity into building this site with Next.js and Tailwind CSS. Explore my interactive projects, clean portfolio, and a glimpse into my technical expertise. If you're seeking a talented developer for your next project or simply looking for inspiration, feel free to get in touch!",
    url: ENV.NEXT_PUBLIC_WEBSITE_URL,
    siteName: 'Beny Dishon K',
    locale: 'en_US',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: 'Beny Dishon K',
    card: 'summary_large_image'
  },
  verification: {
    google: ENV.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
}

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang='en'>
      <body className={`${GeistSans.variable} ${GeistMono.variable} grid h-dvh place-items-center bg-[#3D3D3D] font-mono overflow-hidden`}>
        <Container>
          <div className='flex flex-col h-full'>
            <div className='flex-1 overflow-y-auto min-h-0 pb-4'>{children}</div>
            <div className='flex-shrink-0 navbar-container'>
              <Navbar />
            </div>
          </div>
        </Container>
        <Particles />
        <ResponsiveIndicator />
        <div className='fixed h-[300%] w-[300%] bg-grain-noise opacity-5 animate-grain pointer-events-none top-0' aria-hidden='true' />
        <div className='bg-grid-pattern absolute left-0 top-0 h-full w-full' />
        {process.env.NODE_ENV === 'production' && <Script defer src='https://cloud.umami.is/script.js' data-website-id='b28d632c-a8a2-4f3d-99a6-a7749fbf6335' />}
      </body>
    </html>
  )
}
