import { getFaq } from "@lib/data/faq"
import AccordionItem from "./accordion-item"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Accordion from "@modules/products/components/product-tabs/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  countryCode?: string
  slug?: string
}

const FAQAccordion = async ({ countryCode }: FAQAccordionProps) => {
  const _countryCode = countryCode || "it"
  

  const faqData = await getFaq(_countryCode)
  
    const faqs: FAQItem[] = faqData?.data.map((item: any) => ({
      question: item.Question ?? "",
      answer:
        Array.isArray(item.Answer) && item.Answer.length > 0
          ? item.Answer[0].children?.[0]?.text ?? ""
          : "",
    })) ?? []

  return (
    <div className="content-container py-12 small:py-24 ">
      <h3 className="text-4xl md:text-5xl mb-4 text-center text-theme-text-accent-light">FAQ Domande e Risposte</h3>
      <p className="text-center">Trova qui le risposte veloci alle domande più comuni su ordini, consegne e cura dei prodotti. Se non trovi ciò che cerchi, non esitare a contattarci!</p>
     
     <AccordionItem faqs={faqs} />
      
      <h4 className="text-2xl md:text-2xl mb-4 text-center text-theme-text-accent">Hai altre domande?</h4>
      <p className="text-center">
        <LocalizedClientLink href="/information/contact" title="Contattaci" className="text-theme-accent font-semibold">
          Non esitare a contattarci
          </LocalizedClientLink>
      </p>
    </div>

  )

}

export default FAQAccordion