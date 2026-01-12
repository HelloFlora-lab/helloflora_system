"use client" // include with Next.js 13+

import { useEffect, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"

type ProductProps = {
  product: HttpTypes.StoreProduct
}

const ProductImages = ({ product }: ProductProps) => {

  const [loading, setLoading] = useState(true)
  const [storeProduct, setStoreProduct] = useState<
    HttpTypes.StoreProduct | undefined
  >()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

    console.log("[DEBUG] PROD id ", product.id)

    useEffect(() => {
      if (!loading) {
        return 
      }

        setStoreProduct(product)
        setLoading(false)
    }, [loading, product])

  

  const selectedVariant = useMemo(() => {
    if (
      !product?.variants ||
      !product.options || 
      Object.keys(selectedOptions).length !== product.options?.length
    ) {
      return
    }

    return product.variants.find((variant) => variant.options?.every(
      (optionValue) => optionValue.id === selectedOptions[optionValue.option_id!]
    ))
  }, [selectedOptions, product])

  return (
    <div>
      {loading && <span>Loading...</span>}
      {product && (
        <>
          <h1>{product.title}</h1>
          {(product.options?.length || 0) > 0 && (
            <ul>
              {product.options!.map((option) => (
                <li key={option.id}>
                  {option.title}
                  {option.values?.map((optionValue) => (
                    <button 
                      key={optionValue.id}
                      onClick={() => {
                        setSelectedOptions((prev) => {
                          return {
                            ...prev,
                            [option.id!]: optionValue.value!,
                          }
                        })
                      }}
                    >
                      {optionValue.value}
                    </button>
                  ))}
                </li>
              ))}
            </ul>
          )}
          {selectedVariant && (
            <>
              <span>Selected Variant: {selectedVariant.id}</span>
              {/* TODO: Show add to cart button */}
            </>
          )}
          {product.images?.map((image) => (
            <img src={image.url} key={image.id} />
          ))}
        </>
      )}
    </div>
  )
}
export default ProductImages