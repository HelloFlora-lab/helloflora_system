"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing/billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../NEW/delivery/delivery-address"
import { SubmitButton } from "../submit-button"

const BillingAddresses = ({
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
      <div className="flex flex-row items-center justify-between mb-6">
       


        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="rounded-2xl text-center text-base bg-theme-secondary hover:bg-theme-secondary-light font-medium text-white transition hover:text-white"
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
            <ShippingAddress
              customer={customer}
              checked={true}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            

            <SubmitButton className="mt-6 shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base text-white hover:text-white" data-testid="submit-address-button">
              Scegli Metodo di Consegna
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

export default BillingAddresses
