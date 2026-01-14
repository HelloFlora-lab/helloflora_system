import { HttpTypes } from "@medusajs/types"
import ProductRail from "./product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  return(
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-4xl md:text-5xl mb-4 text-center text-theme-text-accent">
          Fiori Scelti con Cura:<br/><strong>I Nostri Preferiti del Momento</strong>
        </h1>
        <h2 className="text-center mb-2">
          Esplora la nostra esclusiva Selezione di bouquet e composizioni
        </h2>
        <p className="mb-6 text-theme-text-base text-center">
         Abbiamo selezionato ogni mazzo con passione e maestria, scegliendo solo i fiori più freschi e vivaci della stagione. Che tu stia cercando un regalo speciale o voglia semplicemente portare un tocco di natura ed eleganza nella tua casa, troverai qui le creazioni più amate e richieste, realizate dai nostri Fiorari di fiducia. 
         <strong className="text-theme-accent"><br/>Lasciati ispirare e rendi indimenticabile ogni occasione.</strong>
        </p>
    
     {collections.map((collection) => (
    
      <li key={collection.id} className="list-none">
        <ProductRail collection={collection} region={region} />
      </li>
     )) }
    </div>
  )
}