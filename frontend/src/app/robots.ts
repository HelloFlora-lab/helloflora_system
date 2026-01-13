import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/information/','checkout'],
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}