import React, { Suspense } from "react"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductReviews from "../components/product-reviews"
import ProductClientWrapper from "./product-client-wrapper"


type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
      <div>
      {/* 1. Rimuovi la struttura a colonne e il Suspense da qui.
         Passa tutto al componente Client. */}
      <ProductClientWrapper
        product={product}
        region={region}
        countryCode={countryCode}
      />

      <div className=" my-10 small:my-16" data-testid="related-products-container">
        <div className="bg-gray-2">
          <ProductReviews productId={product.id} />
        </div>
        <div>
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
