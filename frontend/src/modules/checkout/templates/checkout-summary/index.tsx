import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="border border-gray-200 rounded-lg px-6 sticky flex flex-col-reverse small:flex-col  ">
      <div className="w-full bg-white flex flex-col gap-y-8 py-8">

        <h1 className="h3-style flex flex-row"  >
          Il tuo carrello
        </h1>
        <CartTotals totals={cart} />

         <div className="mt-2">
          <DiscountCode cart={cart} />
        </div>

        <ItemsPreviewTemplate cart={cart} />
       
      </div>
    </div>
  )
}

export default CheckoutSummary
