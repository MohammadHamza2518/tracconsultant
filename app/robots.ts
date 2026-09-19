import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/api/*', '/dashboard'],
    },
    sitemap: 'https://tracconsultant.com/sitemap.xml',
  };
}
