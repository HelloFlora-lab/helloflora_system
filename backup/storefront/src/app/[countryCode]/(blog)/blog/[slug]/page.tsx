import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"

import qs from "qs"
import { RichTextBlock } from "@modules/blog/components/post-rich-text-block";
import { BlocksRenderer, RootNode } from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import Image from "next/image";
import { getBlogPosts } from "@lib/data/blog";

export async function generateMetadata({ params }: { params: { countryCode: string, slug: string } }): Promise<Metadata> {
  const { countryCode, slug } = params
  const postDetail = (await getBlogPosts(countryCode, slug))?.data[0]
  return {
    title: postDetail?.title + " - HelloFlora" || "Consigli - HelloFlora",
    description: postDetail?.description || "Scopri i consigli di HelloFlora per la cura dei fiori e idee regalo floreali per ogni occasione.",
  }
}

interface PostDetail {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  cover: {
    id: number;
    documentId: string;
    alternativeText: string;
    name: string;
    url: string;
  };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  content: RootNode[];
}



export default async function PostDetail(Props: {
    params: Promise<{ countryCode: string, slug: string }>;
  }) {
  
    const params = await Props.params;
    const { countryCode } = params;
    const region = await getRegion(countryCode);
  
    if (!region) {
      return null;
    }

    const { slug } = params;

  if (!slug) return <p>No post found</p>;

    const postDetail = (await getBlogPosts(countryCode, slug))?.data[0] as PostDetail;

    console.log(postDetail);


  return (
    <>

        <div className="content-container py-12 bg-white lg:pb-20">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full pb-10 px-4">
              
                 {(!postDetail) && (
                    <p>Nessun blog trovato.</p>
                  )}
                  {postDetail && (
                    <div className="blog-post">
                      <h1 className="mb-4 text-xl-semi lg:text-4xl-semi text-theme-secondary">
                        {postDetail.title}
                      </h1>
                      <h2 className="mb-6 text-lg-semi lg:text-xl-regular text-theme-text-accent-light">{postDetail.description}</h2>
                    <Image
                      src={postDetail.cover?.url}
                      width={800}
                      height={400}
                      alt={postDetail.cover?.alternativeText || postDetail.title}
                      title={postDetail.cover?.name || postDetail.title}
                      className="mb-6 rounded-lg"
                    />
                    
                    {postDetail.content && (
                      <RichTextBlock key={postDetail.id} block={postDetail.content}/>
                    )}
                    </div>
                  )}
               
                
             
            </div>
          </div>

        
        </div>
    </>
  )
}


