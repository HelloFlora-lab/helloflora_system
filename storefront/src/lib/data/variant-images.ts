import { sdk } from "@lib/config"

export const fetchVariantImages = async (variantId: string) => {
  const { variant } = await sdk.store.product.retrieve(variantId, {
    fields: "+images.*" // Il prefisso "+" aggiunge il campo a quelli di default
  })

  return variant.images // Array di oggetti immagine: { id, url, ... }
}