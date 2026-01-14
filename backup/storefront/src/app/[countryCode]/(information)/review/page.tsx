import { Metadata } from "next"
import { getReviews } from "@lib/data/reviews"
import ReviewsList from "@modules/customer-review/reviews-list"

export const metadata: Metadata = {
  title: "Recensioni Autentiche e Verificate - HelloFlora",
  description:
    "Leggi le recensioni 100% autentiche e verificate dai nostri clienti. La nostra politica di trasparenza garantisce che solo chi ha acquistato può lasciare un commento.",
}

export default async function Review(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  
  // Fetch iniziale lato server (SEO friendly)
  const { reviews: initialReviews, count } = await getReviews({
    limit: 12, // Stesso limit del client
    offset: 0,
  })

  return (
    <div className="content-container py-12">
      {/* Header Sezione */}
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Le nostre <span className="text-theme-accent">recensioni</span>
        </h1>
        <h2 className="text-xl mb-4">
          La Vostra Fiducia è la Nostra Priorità:<br />
          <strong>Recensioni 100% Autentiche</strong>
        </h2>
        <p className="max-w-2xl text-gray-600">
          Crediamo fermamente che la trasparenza sia la chiave per un rapporto duraturo. 
          Per questo motivo, vi garantiamo che ogni singola recensione che leggete sul nostro sito 
          è genuina, non modificata e proveniente da clienti reali.
        </p>
      </div>

      {/* Componente Client per la lista e paginazione */}
      <ReviewsList />
    </div>
  )
}
