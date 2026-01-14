"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { StoreFlorist } from "types/global"

export const getFloristCheck = async (input: {
  lat: number
  lng: number
}): Promise<StoreFlorist | null> => {

  const headers = {
    "Content-Type": "application/json",
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("florist-check")),
  }

  try {
    const raw: any = await sdk.client.fetch(`/store/florist-check`, {
      method: "POST",
      headers,
      body: input,
      // next,
      cache: "no-store",
    })

    console.log("Florist Check raw response:", raw)

    // supporta varie possibili shape della response
    const storeFlorist =
      raw?.StoreFlorist ??
      raw?.storeFlorist ??
      raw?.florist ??
      raw?.data?.StoreFlorist ??
      raw?.data?.storeFlorist ??
      (raw && Object.keys(raw).length ? raw : null)

    if (!storeFlorist) {
      console.warn("getFloristCheck: nessun StoreFlorist trovato nella response")
      return null
    }

    return storeFlorist as StoreFlorist
  } catch (err) {
    console.error("Error fetching florist check", err)
    return null
  }
}