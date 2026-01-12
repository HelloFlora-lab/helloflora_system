import { Metadata } from "next"

import FeaturedProducts from "@modules/products/components/featured-products"
import Hero from "@modules/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import HomeReview from "@modules/customer-review/home-review"
import DeliveryCheck from "@modules/delivery-check"
import NewsletterCTA from "@modules/layout/components/newsletter-cta"
import FAQAccordion from "@modules/faq"

import FeaturesDisplay from "@modules/features-display"


export const metadata: Metadata = {
  title: "HelloFlora Fiori freschi e bouquet per ogni occasione",
  description:
    "HelloFlora: Acquista online fiori freschi e ricevili a domicilio in poche ore! Il tuo fioraio online di fiducia per ogni occasione. Consegna rapida e fiori di alta qualità.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <DeliveryCheck />
      <FeaturedProducts collections={collections} region={region} />
      <FeaturesDisplay />
      <HomeReview />
      <FAQAccordion />  
      <NewsletterCTA />
      
    </>
  )
}
