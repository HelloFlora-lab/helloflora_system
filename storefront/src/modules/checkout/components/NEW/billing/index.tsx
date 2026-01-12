'use client'
import { HttpTypes } from "@medusajs/types"
import React, { useState } from "react"
import CountrySelect from "../../country-select"
import { Button } from "@medusajs/ui"

import ErrorMessage from "@modules/checkout/components/error-message"

const Billing = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {





    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)  
        try {

            // Logica per inviare i dettagli di fatturazione al backend

        } catch (err) {
            setError("Si è verificato un errore durante il salvataggio dei dettagli di fatturazione.")
        }   finally {
            setIsLoading(false)
        }
    }



  // 1. Stato unificato per tutti i dettagli di fatturazione
  const [billingDetails, setBillingDetails] = useState({
    firstName: cart?.billing_address?.first_name || "",
    lastName: cart?.billing_address?.last_name || "",
    address_1: cart?.billing_address?.address_1 || "",
    company: cart?.billing_address?.company || "",
    postal_code: cart?.billing_address?.postal_code || "",
    city: cart?.billing_address?.city || "",
    country_code: cart?.billing_address?.country_code || cart?.region?.countries[0]?.iso_2 || "",
    province: cart?.billing_address?.province || "",
    phone: cart?.billing_address?.phone || "",
  })

  // 2. Funzione per gestire l'aggiornamento dello stato
  const handleBillingDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setBillingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  return (
    <div className="bg-white min-h-[400px]">
        <div className="items-center mb-6">
            <h2 className="text-center">
                Dati di fatturazione
            </h2>
            <h3 className="text-center h4-style">
              Inserisci i dati di fatturazione, se diversi dai dati di spedizione
            </h3>
            {/* 3. Tutti i campi usano la nuova struttura e il nuovo stato */}
            <div className="grid grid-cols-2 gap-4 my-2">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Nome</label>
                    <input
                        type="text"
                        placeholder="Inserisci il nome"
                        name="firstName"
                        value={billingDetails.firstName}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Cognome</label>
                    <input
                        type="text"
                        placeholder="Inserisci il cognome"
                        name="lastName"
                        value={billingDetails.lastName}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Indirizzo</label>
                    <input
                        type="text"
                        placeholder="Inserisci l'indirizzo"
                        name="address_1"
                        value={billingDetails.address_1}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Azienda (Opzionale)</label>
                    <input
                        type="text"
                        placeholder="Inserisci l'azienda"
                        name="company"
                        value={billingDetails.company}
                        onChange={handleBillingDetailsChange}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">CAP</label>
                    <input
                        type="text"
                        placeholder="Inserisci il CAP"
                        name="postal_code"
                        value={billingDetails.postal_code}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Città</label>
                    <input
                        type="text"
                        placeholder="Inserisci la città"
                        name="city"
                        value={billingDetails.city}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Paese</label>
                    <CountrySelect
                        name="country_code"
                        region={cart?.region}
                        value={billingDetails.country_code}
                        onChange={handleBillingDetailsChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Provincia</label>
                    <input
                        type="text"
                        placeholder="Inserisci la provincia"
                        name="province"
                        value={billingDetails.province}
                        onChange={handleBillingDetailsChange}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Telefono</label>
                    <input
                        type="tel"
                        placeholder="Inserisci il telefono"
                        name="phone"
                        value={billingDetails.phone}
                        onChange={handleBillingDetailsChange}
                        required
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    />
                </div>
            </div>

             <div className="">
                <ErrorMessage error={error} data-testid="delivery-option-error-message"/>
                <Button
                    size="large"
                    className="mt-6 shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base text-white hover:text-white"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    disabled={!cart?.billing_address?.first_name || isLoading}
                    data-testid="submit-delivery-option-button"
                    >
                    Continua
                </Button>
            </div>
        </div>
    </div>
  )
}

export default Billing