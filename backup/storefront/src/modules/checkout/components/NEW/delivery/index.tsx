"use client"

import { setAddresses } from "@lib/data/cart"

import { HttpTypes } from "@medusajs/types"
import { Text, useToggleState } from "@medusajs/ui"


import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useState } from "react"

import ErrorMessage from "../../error-message"
import ShippingAddress from "./delivery-address"
import { SubmitButton } from "../../submit-button"
import DeliveryMethod from "./delivery-method"

const DeliveryData = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

 // const isOpen = searchParams.get("step") === "address"
  const isOpen = true; // Forza l'apertura del modulo di indirizzo per il test


  const [sameAsBilling, toggleSameAsBilling] = useToggleState(true)

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }


   

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white">
        <div className="items-center mb-6">
             <h2 className="text-center">
             Dati consegna
        </h2>
        <h3 className="text-center my-2 h4-style">
            Compila i campi sottostanti per indicare l'indirizzo di consegna del tuo ordine.
        </h3>
        </div>
      <div className="flex flex-row items-center justify-between mb-6">
        {isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-4 py-2 text-center text-base text-white hover:text-white"
              data-testid="edit-address-button"
            >
              Modifica
            </button>
          </Text>
        )}

      </div>
      {isOpen ? (
        <form action={formAction}>

          <div className="pb-8">
            <ShippingAddress customer={customer} onChange={toggleSameAsBilling} cart={cart} />

           

            <SubmitButton className="mt-6 shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-4 py-2 text-center text-base text-white hover:text-white" data-testid="submit-address-button">
              Procedi
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
         
        </div>
      )}
    </div>
  )
}

export default DeliveryData
