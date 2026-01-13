"use client"

import Spinner from "@modules/common/icons/spinner"
import { clx } from "@medusajs/ui"

type CartItemQuantityProps = {
  quantity: number
  maxQuantity?: number
  minQuantity?: number
  isLoading?: boolean
  onQuantityChange: (quantity: number) => void
  className?: string
}

const CartItemQuantity = ({
  quantity,
  maxQuantity = 5, // Impostato a 5 come richiesto
  minQuantity = 1,
  isLoading = false,
  onQuantityChange,
  className,
}: CartItemQuantityProps) => {
  
  const decrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1)
    }
  }

  const increase = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  return (
    <div className={clx("flex items-center border border-gray-200 rounded-md h-8 w-24 overflow-hidden bg-white", className)}>
      <button
        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        onClick={decrease}
        disabled={quantity <= minQuantity || isLoading}
        type="button"
        aria-label="Diminuisci quantità"
      >
        -
      </button>

      <div className="flex-1 flex items-center justify-center text-sm font-medium w-8 text-gray-900">
        {isLoading ? <Spinner /> : quantity}
      </div>

      <button
        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        onClick={increase}
        disabled={quantity >= maxQuantity || isLoading}
        type="button"
        aria-label="Aumenta quantità"
      >
        +
      </button>
    </div>
  )
}

export default CartItemQuantity