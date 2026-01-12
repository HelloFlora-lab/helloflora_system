import { Metadata } from "next"

import { Text, clx } from "@medusajs/ui"
import { getRegion } from "@lib/data/regions"
import FAQAccordion from "@modules/faq/faq-accordion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "FAQ HelloFlora: Domande Frequenti e Supporto",
  description:
    "Hai domande su spedizioni, pagamenti, cura delle piante o resi? Consulta le FAQ di HelloFlora: trova risposte rapide e chiare per ogni tua esigenza.",
}

export default async function Faq(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  //const region = await getRegion(countryCode)



  return (
    <>
     <div className="content-container py-12">
        <h1 className="mb-4 text-center">
          FAQ <strong>Domande e Risposte</strong>
        </h1>
        <h2 className="mb-4 text-center">
          Trova tutte le risposte di cui hai bisogno in modo <strong>rapido e semplice.</strong>
        </h2>
         <p className=" ">
         Questa sezione di Domande Frequenti (FAQ) è stata creata per raccogliere e chiarire i dubbi più comuni relativi ai nostri prodotti, servizi e procedure. Consulta le domande organizzate per categorie per trovare soluzioni immediate e risparmiare tempo. Se il tuo quesito non è presente, il nostro team di supporto è sempre a tua disposizione.
        </p>
        <FAQAccordion countryCode={countryCode} />

         <h4 className="text-center my-5">Hai altre <strong>domande?</strong></h4>
          <p className="text-center">
            <LocalizedClientLink href="/information/contact" title="Contattaci" className="text-theme-accent font-semibold">
              Non esitare a contattarci
            </LocalizedClientLink>
          </p>
      </div>
    </>
  )
}
