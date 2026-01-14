import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HelloFlora',
    short_name: 'HelloFlora',
    description: 'HelloFlora ',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: 'images/favicons/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}