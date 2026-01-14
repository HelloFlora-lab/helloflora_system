import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "I tuoi Indirizzi di spedizione - HelloFlora",
  description: "Visualizza i tuoi indirizzi di spedizione salvati.",
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
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Indirizzi di spedizione</h1>
        <p className="text-base-regular">
          Visualizza e aggiorna i tuoi indirizzi di spedizione, puoi aggiungerne
          quanti ne vuoi. Salvare i tuoi indirizzi li renderà disponibili durante il checkout.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
