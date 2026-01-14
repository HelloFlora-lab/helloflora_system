import { Metadata } from "next"

import { Text, clx } from "@medusajs/ui"
import { getRegion } from "@lib/data/regions"
import { RootNode } from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import { getContentPages } from "@lib/data/content-page";
import { RichTextBlock } from "@modules/blog/components/post-rich-text-block";


export async function generateMetadata({ params }: { params: { slug: string, countryCode: string } }): Promise<Metadata> {
  const contentPage = await fetchContentPage(params.countryCode, params.slug)

  if (!contentPage) {
    return {}
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://helloflora.net'),
    title: { default: contentPage.seo[0].metaTitle || "Welcome", template: '%s | HelloFlora' },
    robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  
    description: contentPage.seo[0].metaDescription || 'Welcome to HelloFlora',
    alternates: {
      canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://helloflora.net',
      languages: {
        'it': process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/it` : 'https://helloflora.net/it',
        'es': process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/es` : 'https://helloflora.net/es',
      }
    },
    openGraph: {
      title: contentPage.seo[0].metaTitle || "Welcome to HelloFlora",
      description: contentPage.seo[0].metaDescription || 'Welcome to HelloFlora',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'https://helloflora.net',
      siteName: 'HelloFlora',
      images: [{ url: process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/og.png` : 'https://helloflora.net/og.png' }]
    },
  }
}


interface ContentPageDetail {
  id: number;
  title: string;
  slug: string;
  date: string;
  seo:  [{
    metaTitle: string;
    metaDescription: string;
  }];
  publishedAt: string;
  content: RootNode[];
}

async function fetchContentPage(countryCode: string, slug: string): Promise<ContentPageDetail | null> {
  const res = await getContentPages(countryCode, slug)
  return res?.data[0] as ContentPageDetail || null
}



export default async function ContentPage({ params }: { params: { countryCode: string, slug: string } }) {
  
  const contentPageDetail = await fetchContentPage(params.countryCode, params.slug)

  if (!params.slug) return <p>Content not found</p>

  return (
    <div className="content-container py-12">
      {!contentPageDetail && <p>No content found.</p>}
      {contentPageDetail && (
        <div>
          <h1 className="mb-4">{contentPageDetail.title}</h1>
          {contentPageDetail.content && (
            <RichTextBlock key={contentPageDetail.id} block={contentPageDetail.content} />
          )}
        </div>
      )}
    </div>
  )
}
