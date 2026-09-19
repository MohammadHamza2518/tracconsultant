import { MetadataRoute } from 'next';
import { SERVICES_LIST, TOOLS_LIST } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tracconsultant.com';

  const staticPages = [
    '',
    '/services',
    '/tools',
    '/calculators',
    '/about',
    '/contact',
    '/track',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
    '/shipping-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const servicePages = SERVICES_LIST.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const toolPages = TOOLS_LIST.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticPages, ...servicePages, ...toolPages];
}
