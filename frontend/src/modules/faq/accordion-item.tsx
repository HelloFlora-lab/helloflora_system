'use client'
import { ArrowDown } from "@medusajs/icons"
import React, { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface AccordionItemProps {
  faqs: FAQItem[]
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faqs }) => {

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className=" mx-auto my-8 bg-theme-secondary-light p-6 rounded-lg shadow-md">
      {faqs.map((faq, idx) => (
        <div key={idx} className="border-b border-theme-main last:border-0 py-4">
          <button
            className="w-full text-left py-4 font-semibold flex justify-between items-center"
            onClick={() => toggleAccordion(idx)}
          >
            <h3>
              {faq.question}
            </h3>
           <span
              className={`ml-2 transition-transform duration-200 ${
                openIndex === idx ? "rotate-180" : ""
              }`}
            >
              <ArrowDown />
            </span>
          </button>
          {openIndex === idx && (
            <div className="py-2 text-gray-700">
              <p>
                {faq.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AccordionItem