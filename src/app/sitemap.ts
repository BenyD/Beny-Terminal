import { MetadataRoute } from 'next';

import { ENV } from '@/lib/constants';
import { getContents } from '@/lib/contents';

export default function sitemap(): MetadataRoute.Sitemap {
  const URL = ENV.NEXT_PUBLIC_WEBSITE_URL;

  const routes = [
    '',
    '/coding-activity',
    '/coding-activity/activity',
    '/coding-activity/editor',
    '/coding-activity/operating-systems',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const aboutRoutes = getContents('abouts').map((route) => ({
    url: `${URL}/abouts/${route.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...aboutRoutes];
}
