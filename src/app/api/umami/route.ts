import { NextResponse } from 'next/server';
import { ENV } from '@/lib/constants';

/**
 * Server-side API proxy for Umami analytics data using the Umami Cloud API.
 * This endpoint supports two methods to fetch pageviews:
 * 1. Using the public share URL (no authentication needed)
 * 2. Using the Umami API with an API key (preferred if configured)
 */
export async function GET() {
  // First, try using the API key method if configured
  if (ENV.UMAMI_API_KEY) {
    try {
      const websiteId = ENV.UMAMI_WEBSITE_ID;
      if (!websiteId) {
        throw new Error('UMAMI_WEBSITE_ID is required when using API key');
      }

      // Calculate time parameters (required by the API)
      // End time is now, start time is 30 days ago
      const endAt = Date.now();
      const startAt = endAt - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

      // According to Umami Cloud docs, API requests should go to this endpoint
      const apiUrl = `https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;

      console.log(`Fetching Umami data using API key from: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-umami-api-key': ENV.UMAMI_API_KEY,
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `API key request failed (${response.status}): ${errorText}`
        );
        throw new Error(`Failed to fetch from Umami API: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        'Umami API response:',
        JSON.stringify(data).substring(0, 200) + '...'
      );

      // Extract pageviews from API response
      let pageViewsCount = null;
      if (data.pageviews !== undefined) {
        pageViewsCount =
          typeof data.pageviews === 'number'
            ? data.pageviews
            : data.pageviews.value || data.pageviews;
      }

      return NextResponse.json({
        pageviews: { value: pageViewsCount },
        source: 'api-key',
      });
    } catch (apiError) {
      console.error('API key method failed:', apiError);
      // Fall through to share URL method if API key method fails
    }
  }

  // Fallback to using the share URL method
  try {
    // Make sure we have the necessary environment variables
    const shareToken = ENV.UMAMI_SHARE_TOKEN;
    if (!shareToken) {
      throw new Error('UMAMI_SHARE_TOKEN environment variable is missing');
    }

    // The correct format for share URL appears to be just the token, not token/domain
    // Let's extract just the token part if it contains a slash
    const cleanShareToken = shareToken.split('/')[0];

    // For public share URLs, we can directly access the share data
    const shareUrl = `https://cloud.umami.is/api/share/${cleanShareToken}`;

    console.log(`Trying share URL method: ${shareUrl}`);

    const response = await fetch(shareUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from share URL: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      'Share URL response:',
      JSON.stringify(data).substring(0, 200) + '...'
    );

    // The share API structure may vary, so we'll try to find the pageviews in different places
    let pageViewsCount = null;

    // Look for pageviews in various locations
    if (typeof data.pageviews === 'number') {
      pageViewsCount = data.pageviews;
    } else if (data.pageviews?.value !== undefined) {
      pageViewsCount = data.pageviews.value;
    } else if (data.stats?.pageviews !== undefined) {
      pageViewsCount = data.stats.pageviews;
    }

    return NextResponse.json({
      pageviews: { value: pageViewsCount },
      source: 'share-url',
    });
  } catch (error) {
    console.error('All methods failed:', error);

    // Return a default response when all methods fail
    return NextResponse.json(
      {
        pageviews: { value: null },
        error: 'Failed to fetch data from Umami',
        note: 'Please set up your UMAMI_API_KEY or ensure your UMAMI_SHARE_TOKEN is correct',
      },
      { status: 200 }
    );
  }
}
