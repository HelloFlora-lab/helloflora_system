"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment/payment-button"
import { useSearchParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Conferma ordine
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Cliccando sul pulsante Ordina!, confermi di aver letto, compreso
                e accettato i nostri Termini di utilizzo, Termini di vendita e
                Politica di reso e riconosci di aver letto l'Informativa sulla
                <LocalizedClientLink href="/information/privacy-policy" title="Informativa sulla privacy" target="_blank">privacy</LocalizedClientLink> e i <LocalizedClientLink href="/information/terms-and-conditions" title="Termini e condizioni" target="_blank">termini e condizioni del nostro servizio</LocalizedClientLink>.
 
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
