"use client"

import React, { Suspense, useEffect, useState } from "react"

import ImageGallery from "@modules/products/components/image-gallery/image-gallery"
import ProductActions from "@modules/products/components/product-actions"

import ProductInfo from "@modules/products/templates/product-info"


import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import ProductReviews from "../components/product-reviews"
import ProductDisclaimer from "../components/product-disclaimer"
import InfoDelivery from "../components/product-info-delivery"


type ProductClientWrapperProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductClientWrapper: React.FC<ProductClientWrapperProps> = ({
  product,
  region,
  countryCode,
}) => {
  
  // Lo stato della variante selezionata vive qui, nel componente client.
  const [selectedVariant, setSelectedVariant] =
    useState<HttpTypes.StoreProductVariant | undefined>(product.variants?.[0])

  // DEBUG: Questo useEffect si attiva ogni volta che 'selectedVariant' cambia.
  useEffect(() => {
    
    console.log("DEBUG: Variante selezionata aggiornata:", selectedVariant?.title, selectedVariant)

  }, [selectedVariant])

  // Determina quali immagini mostrare in base alla variante
  const galleryImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : product.images || []

  // DEBUG: Controlliamo cosa viene calcolato e passato a ImageGallery
  console.log(
    "DEBUG: Calcolo Immagini Galleria:",
    {
      "Sorgente Immagini": selectedVariant?.images?.length ? "Da Variante Selezionata" : "Da Prodotto Principale",
      "Immagini Variante": selectedVariant?.images,
      "Immagini Finali (galleryImages)": galleryImages,
    }
  )

  return (
    <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative" data-testid="product-container">
      <div className="block w-full relative">
        <ImageGallery images={galleryImages} />
      </div>
      <div className="flex flex-col small:sticky small:py-0 small:max-w-[400px] w-full ps-5 gap-y-5">
        <ProductInfo product={product} />
        <ProductActions
          product={product}
          region={region}
          onVariantChange={setSelectedVariant}
        />
        <InfoDelivery region={region} countryCode={countryCode} />
        <ProductDisclaimer region={region} countryCode={countryCode} />
      </div>
    </div>
  )
}

export default ProductClientWrapper