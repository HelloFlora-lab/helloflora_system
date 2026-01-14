import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import PaymentWrapper from "@modules/checkout/components/NEW/payment/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout - HelloFlora",
  description: "Completa il tuo ordine su HelloFlora",
}

// La pagina riceve searchParams come prop
export default async function Checkout({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Carica i dati necessari qui
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  // Logica per determinare currentStepIndex
  let currentStepIndex = 0
  const step = (await searchParams).step

  switch (step) {
    case "verify":
      currentStepIndex = 0
      break
    case "delivery":
      currentStepIndex = 1
      break
    case "billing":
      currentStepIndex = 2
      break
    case "payment":
      currentStepIndex = 3
      break
    case "review":
      currentStepIndex = 4
      break
    default:
      currentStepIndex = 0
      break
  }

  console.log("[DEBUG] Current Step Index:", step)

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-10 py-8">
      <PaymentWrapper cart={cart}>
        <CheckoutForm
          cart={cart}
          customer={customer}
          shippingMethods={shippingMethods}
          paymentMethods={paymentMethods}
          currentStepIndex={currentStepIndex}
        />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
