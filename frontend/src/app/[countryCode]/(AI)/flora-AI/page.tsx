import { Metadata } from "next"

import { Text, clx } from "@medusajs/ui"
import { getRegion } from "@lib/data/regions"

import AIMessageGenerator from "@modules/ai/ai-message-generator"

export const metadata: Metadata = {
  title: "HelloFlora AI - Il Tuo Assistente Personale per Messaggi Floreali",
  description:
    "Dai voce ai tuoi fiori con Flora AI, la nostra assistente di Intelligenza Artificiale. Crea messaggi personalizzati e dediche uniche in pochi secondi. Provalo subito!",
}

export default async function CardMessage(props: {
  params: Promise<{ countryCode: string }>
}) {
 // const params = await props.params

  //const { countryCode } = params

  //const region = await getRegion(countryCode)


  return (
    <div className="content-container py-12 bg-white lg:pb-20">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full pb-10 px-4 text-center">

                  <h1 className="mb-4">HelloFlora AI </h1>
                  <h2 className="mb-6 h3-style">
                    Dai voce ai tuoi fiori con la nostra assistente di Intelligenza Artificiale
                  </h2>
                  <p className="text-base ">Crea biglietti e messaggi magici per i tuoi fiori. Con <strong>Flora AI</strong>, la tua dedica unica e originale è a portata di click. Esprimi i tuoi sentimenti in modo unico ora!
                  </p>
             
            </div>
          </div>

          <div className="-mx-4 flex flex-wrap">
           <AIMessageGenerator />
         
          </div>
        </div>




    
  )
}
