import { getBlogPosts } from "@lib/data/blog"
import { getRegion } from "@lib/data/regions"
import {  getShortText } from "@lib/util/short-text";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

interface BlogPostProps {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover: {
      id: number;
      documentId: string;
      alternativeText: string;
      name: string;
      url: string;
    };
    publishedAt: string;
}

export default async function FooterBlogPosts () {
    //const region = await getRegion(countryCode)
  /*
    if (!region) {
      return null
    }
  */
 const countryCode = "it";
    const blogPosts = await getBlogPosts(countryCode, undefined, 1, 3);
    
  return (
    <div className="mb-10 w-fulll">
              <h4 className="mb-9 text-lg font-semibold text-theme-text-accent sm:text-left text-center">
                I consigli di HelloFlora
              </h4>
              
            {(!blogPosts.data || blogPosts.data.length === 0) && (
              <p>No blog posts available.</p>
            )}
            {blogPosts && blogPosts.data.length > 0 && blogPosts.data.map((postData:  BlogPostProps) => (
             <div className="flex" key={postData.id}>
                 <LocalizedClientLink href={`/blog/${postData.slug}`} title={postData.title}>
                  <div className="flex items-center mb-4">
                    <Image
                      src={postData.cover.url}
                      alt={postData.cover.alternativeText || postData.cover.name}
                      width={90}
                      height={90}
                      className="rounded-lg shadow-md mr-5"
                    />
                    <h5 className="text-theme-text-accent-light text-sm">
                      {getShortText(postData.description)}
                    </h5>
                  </div>
                </LocalizedClientLink>
                </div>
           
            ))}
    </div>    
    );
}   


