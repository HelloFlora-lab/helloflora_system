import { HttpTypes } from "@medusajs/types"

import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-2 lg:max-w-[500px] mx-auto">
        
        {(product.categories?.length ?? 0) > 0 && (
          <LocalizedClientLink
            href={`/collections/${product.categories![0].handle}`}
            className="text-base-bold text-theme-text-accent hover:text-theme-text-accent-light transition-colors"
          >
            {product.categories![0].name}
          </LocalizedClientLink>
        )}
        <h1 className="h2-style text-theme-accent ">
           {product.title}
        </h1>
        <h2 className="h3-style text-theme-main antialiased">
          {product.subtitle}
        </h2>

        <p
          className="text-base-regular"
          data-testid="product-description"
        >
          {product.description}
        </p>
        {(product.tags?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags?.map((tag) => (
              <span
                key={tag.id}
                className="text-small-regular bg-theme-secondary-light rounded-rounded px-2 py-1 text-theme-accent">
                {tag.value}
              </span>
            ))}
          </div>
        )}
      </div>
    
    </div>
  )
}

export default ProductInfo
