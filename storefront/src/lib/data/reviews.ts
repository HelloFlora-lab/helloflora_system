"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { HttpTypes } from "@medusajs/types"
import { StoreReview } from "types/global"

export const getReviews = async ({
  limit = 10,
  offset = 0,
}: {
  limit?: number
  offset?: number 
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  /*
  const next = {
    ...(await getCacheOptions(`product-reviews-${productId}`)),
  }
*/
  return sdk.client.fetch<{
    reviews: StoreReview[]
    limit: number
    offset: number
    count: number
  }>(`/store/reviews`, {
    headers,
    query: {
      limit,
      offset,
      order: "-created_at",
    },
    //next,
    //TO DO verificare la cache con parametro "force-cache"
    cache: "no-store",
  })
}