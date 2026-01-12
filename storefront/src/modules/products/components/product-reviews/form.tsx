"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Label, Textarea, toast, Toaster } from "@medusajs/ui"
import { addProductReview } from "../../../../lib/data/products"
import StarSolid from "@modules/common/icons/star-solid"
import Star from "@modules/common/icons/star"

type ProductReviewsFormProps = {
  productId: string
}

export default function ProductReviewsForm({ productId }: ProductReviewsFormProps) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isCustomerLoading, setIsCustomerLoading] = useState(true) // Stato per il caricamento del cliente
  const [isSubmitting, setIsSubmitting] = useState(false) // Stato per l'invio del form
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)

  useEffect(() => {
 
    retrieveCustomer()
      .then((customerData) => {
       
        setCustomer(customerData)
      })
      .catch((error) => {
        console.error("[ReviewForm] Errore nel recupero del cliente:", error);
        // Non mostriamo il form se il cliente non può essere recuperato
      })
      .finally(() => {
        setIsCustomerLoading(false)
      })
  }, []) // L'array vuoto assicura che venga eseguito solo una volta

  // Se stiamo ancora cercando di capire se l'utente è loggato, non mostriamo nulla
  if (isCustomerLoading) {
    return <div className="h-16"></div> // Placeholder per evitare sfarfallio
  }

  // Se l'utente non è loggato, non mostriamo il form
  if (!customer) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!content || !rating) {
    
      toast.error("Errore", {
        description: "Per favore, compila i campi obbligatori (Contenuto e Valutazione).",
      })
      return
    }

    setIsSubmitting(true)

    const payload = {
      title,
      content,
      rating,
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      product_id: productId,
    }

    addProductReview(payload)
      .then((response) => {
        console.log("[ReviewForm] Risposta API in caso di successo:", response);
        setShowForm(false)
        setTitle("")
        setContent("")
        setRating(0)
        toast.success("Successo", {
          description: "La tua recensione è stata inviata e attende approvazione.",
        })
      })
      .catch((error) => {
        console.error("[ReviewForm] Errore durante l'invio della recensione:", error);
        toast.error("Errore", {
          description: "Si è verificato un errore durante l'invio della recensione. Riprova più tardi.",
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className="product-page-constraint mt-8">
      {!showForm && (
        <div className="flex justify-center">
          <Button variant="primary" className="items-center shadow-none justify-center rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white" 
          onClick={() => setShowForm(true)}>Nuova recensione prodotto</Button>
        </div>
      )}
      {showForm && (
        <div className="gap-y-4 justify-center items-center w-80 mx-auto">
          <div className="gap-y-2 max-w-full">
            <span className="text-normal-regular text-theme-text-base pb-3 block">
              Aggiungi una nuova recensione prodotto
            </span>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 items-center text-center">
              <div className="flex flex-col gap-y-2">
              
                <Input name="title" className="w-60 text-center" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo recensione" />
              </div>
              <div className="flex flex-col gap-y-2">
             
                <Textarea name="content" className="w-60 text-center" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Descrizione recensione" />
              </div>
              <div className="flex flex-col gap-y-2">
               
                <div className="flex gap-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Button key={index} variant="transparent" onClick={(e) => {
                      e.preventDefault()
                      setRating(index + 1)
                    }} className="p-0">
                      {rating >= index + 1 ? <StarSolid size={32} /> : <Star size={32} />}
                    </Button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-60 items-center shadow-none justify-center rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white">
                {isSubmitting ? "Invio in corso..." : "Invia"}
              </Button>
            </form>
          
          </div>

        </div>
      )}
      <Toaster />
    </div>
  )
}