"use server"
import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "./cookies"


export const addNewsletterSubscription = async (input: {
  email: string
}) => {
  console.log(`[Server Action: addNewsletterSubscription] Ricevuto input:`, input);

  try {
    const headers = {
      "Content-Type": "application/json",
      ...(await getAuthHeaders()),
    }
    console.log(`[Server Action: addNewsletterSubscription] Headers preparati per la richiesta:`, headers);

    // Rimuovi JSON.stringify e passa l'oggetto 'input' direttamente.
    // L'SDK di Medusa gestirà la serializzazione.
    const res = await sdk.client.fetch(`/store/newsletter-signup`, {
      method: "POST",
      headers,
      body: input, // MODIFICA QUI: Rimuovi JSON.stringify()
      cache: "no-store",
    })

    console.log(`[Server Action: addNewsletterSubscription] Risposta grezza ricevuta dal backend:`, res);

    // cerca di normalizzare la response
    try {
      // sdk.client.fetch potrebbe già restituire JSON, ma gestiamo entrambe le possibilità
      const parsedResponse = typeof res === "string" ? JSON.parse(res) : res;
      console.log(`[Server Action: addNewsletterSubscription] Risposta parsata con successo:`, parsedResponse);
      return parsedResponse;
    } catch (parseErr) {
      console.error(`[Server Action: addNewsletterSubscription] Errore durante il parsing della risposta. La risposta grezza era:`, res, `Errore:`, parseErr);
      return res; // Restituisce la risposta grezza se il parsing fallisce
    }
  } catch (apiError) {
    console.error(`[Server Action: addNewsletterSubscription] Errore durante la chiamata API a sdk.client.fetch:`, apiError);
    // Rilancia l'errore o restituisci un oggetto di errore strutturato
    // Questo farà fallire la promise sul client e attiverà il blocco .catch()
    throw apiError;
  }
}