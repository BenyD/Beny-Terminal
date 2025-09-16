export const ENV = {
  NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://terminal.beny.one/',
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: '',

  UMAMI_SHARE_TOKEN: process.env.UMAMI_SHARE_TOKEN || '',
  UMAMI_URL: process.env.UMAMI_URL || '',
  UMAMI_WEBSITE_ID: process.env.UMAMI_WEBSITE_ID || '1abbea7f-9003-4017-93b9-69922061d6f0',
  UMAMI_API_KEY: process.env.UMAMI_API_KEY || '',

  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || '',
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || '',
  SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || '',

  NODE_ENV: process.env.NODE_ENV || 'development'
}
