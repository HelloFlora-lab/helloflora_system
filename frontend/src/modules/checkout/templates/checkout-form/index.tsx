import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import CheckoutWizard from "@modules/checkout/templates/checkout-wizard"

import DeliveryCheck from "@modules/checkout/components/NEW/check"
import DeliveryData from "@modules/checkout/components/NEW/delivery"

import Billing from "@modules/checkout/components/NEW/billing"

import Payment from "@modules/checkout/components/NEW/payment"
import Review from "@modules/checkout/components/NEW/review"
import Shipping from "@modules/checkout/components/shipping"
import DeliveryDetails from "@modules/checkout/components/NEW/delivery/delivery"


export default async function CheckoutForm({
  cart,
  customer,
  currentStepIndex,
  }: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  currentStepIndex: number
}) {
  if (!cart) {
    return null
  }

  // Definiamo i passaggi del nostro wizard
  const checkoutSteps = ["Verifica", "Consegna", "Mittente", "Pagamento", "Conferma"];
/*
  if (cart.shipping_address && cart.shipping_methods.length > 0) {
    currentStepIndex = 2; // Va al pagamento
  } else if (cart.shipping_address) {
    currentStepIndex = 1; // Va alla spedizione
  }
  // Aggiungi altre logiche per 'Pagamento' e 'Riepilogo' se necessario

  */
  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  //currentStepIndex= 1 // FORZATO AL BILANCIO PER TESTARE
  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="item-center">
      <CheckoutWizard steps={checkoutSteps} currentStep={currentStepIndex} />
    
      <div className="w-full gap-y-8 border border-gray-200 rounded-lg p-6 grid grid-cols-1">
  
        <div className="w-full">
          {currentStepIndex === 0 && (
           <DeliveryCheck cart={cart} customer={null} />
          )}

          {currentStepIndex === 1 && (
          <DeliveryDetails cart={cart} availableShippingMethods={shippingMethods || null} />
            /*
          <DeliveryData cart={cart} customer={customer} />
          */
          )}
          
          {currentStepIndex === 2 && (
            <Billing cart={cart} />
          )}

          {currentStepIndex === 3 && (
             <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          )}

          {currentStepIndex === 4 && (
           <Review cart={cart} />
          )}

        </div>
 
       
         {/*}
          <BillingAddresses cart={cart} customer={customer} />
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          <Review cart={cart} />

          */}
       
      </div>
  </div>
  )
}
