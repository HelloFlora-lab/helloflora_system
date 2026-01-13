'use client'
import { HttpTypes } from "@medusajs/types"
import React, { useState, useEffect, Fragment } from "react"
import CountrySelect from "../../country-select"
import { Button } from "@medusajs/ui"
import { Combobox, Transition } from "@headlessui/react"
import { Check, ChevronDown } from "@medusajs/icons"
import ReactCountryFlag from "react-country-flag"
import { countries } from "@lib/data/countries"

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

    // Phone logic
    const [query, setQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === "IT") || countries[0])
    const [phoneNumber, setPhoneNumber] = useState("")

    // Initialize phone from cart if exists
    useEffect(() => {
        if (cart?.billing_address?.phone && !phoneNumber) {
            const phone = cart.billing_address.phone
            // Try to find matching country code
            const country = countries.find(c => phone.startsWith(c.dial_code))
            if (country) {
                setSelectedCountry(country)
                setPhoneNumber(phone.replace(country.dial_code, ""))
            } else {
                setPhoneNumber(phone)
            }
        }
    }, [cart?.billing_address?.phone])

    const filteredCountries =
        query === ""
        ? countries
        : countries.filter((country) =>
            country.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .includes(query.toLowerCase().replace(/\s+/g, "")) ||
            country.dial_code.includes(query)
            )

    // Update billingDetails when phone parts change
    useEffect(() => {
        const fullPhone = `${selectedCountry.dial_code}${phoneNumber}`
        setBillingDetails(prev => {
            if (prev.phone !== fullPhone) {
                return { ...prev, phone: fullPhone }
            }
            return prev
        })
    }, [selectedCountry, phoneNumber])

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
                Dati del mittente (chi invia)
            </h2>
            <h3 className="text-center h4-style">
              Inserisci i dati del mittente
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
                    <div className="flex gap-2">
                        <div className="w-32 relative">
                        <Combobox value={selectedCountry} onChange={(val) => val && setSelectedCountry(val)}>
                            <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-200 bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(country: any) => country.dial_code}
                                onChange={(event) => setQuery(event.target.value)}
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                                </Combobox.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery('')}
                            >
                                <Combobox.Options className="absolute mt-1 max-h-60 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                                {filteredCountries.length === 0 && query !== '' ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                    </div>
                                ) : (
                                    filteredCountries.map((country) => (
                                    <Combobox.Option
                                        key={country.code}
                                        className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-theme-accent text-white' : 'text-gray-900'
                                        }`
                                        }
                                        value={country}
                                    >
                                        {({ selected, active }) => (
                                        <>
                                            <span
                                            className={`block truncate ${
                                                selected ? 'font-medium' : 'font-normal'
                                            }`}
                                            >
                                            <ReactCountryFlag countryCode={country.code} svg className="mr-2" />
                                            <span className="mr-2">{country.dial_code}</span>
                                            {country.name}
                                            </span>
                                            {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active ? 'text-white' : 'text-teal-600'
                                                }`}
                                            >
                                                <Check className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                            ) : null}
                                        </>
                                        )}
                                    </Combobox.Option>
                                    ))
                                )}
                                </Combobox.Options>
                            </Transition>
                            </div>
                        </Combobox>
                        </div>
                        <input
                        type="tel"
                        placeholder="Inserisci il telefono"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent mt-1"
                        />
                    </div>
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