import { Metadata } from "next"

import { getRegion } from "@lib/data/regions"
import {BlogPostCard, BlogPostCardProps } from "@modules/blog/components/post-card"
import qs from "qs"
import { getBlogPosts } from "@lib/data/blog"
import BlogPost from "@modules/blog/components/blog-post"

export const metadata: Metadata = {
  title: "I Consigli di HelloFlora: Guida e Ispirazione sul Mondo dei Fiori",
  description:
    "Esplora I Consigli di HelloFlora! Trova guide pratiche, idee creative e suggerimenti degli esperti per la cura delle piante, la scelta dei fiori e l'arredo con il verde.",
}


export default async function Blog (props: {
  params: Promise<{ countryCode: string }>
}) {

  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }


  return (
    <>
    
        <div className="content-container py-12 bg-white lg:pb-20">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full pb-10 px-4">

                  <h1 className="mb-4">
                  I consigli di <strong>HelloFlora</strong>
                  </h1>
                  <h2 className="mb-6">
                    Guide, Tutorial e Consigli Pratici sul <strong>Mondo dei Fiori</strong>
                  </h2>
                  <p className="text-base ">
                    Scopri il segreto di ogni fiore! Il blog di HelloFlora ti offre guide complete sui significati nascosti, consigli per scegliere la composizione adatta a ogni evento e la cura post-acquisto.
                  </p>
             
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap">
           <BlogPost countryCode={countryCode} />
         
          </div>
        </div>
      
    </>
  )
}


