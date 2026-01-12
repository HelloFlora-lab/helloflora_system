import { getFaq } from "@lib/data/faq"
import AccordionItem from "./accordion-item"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  countryCode?: string
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
   
      <AccordionItem faqs={faqs} />
    
      

  )

}

export default FAQAccordion