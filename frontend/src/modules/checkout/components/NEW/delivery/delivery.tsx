"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SetStateAction, useEffect, useState, Fragment } from "react"
import { RadioGroup, Radio, Combobox, Transition } from "@headlessui/react"
import {  Loader, Clock, ChevronDown, Check } from "@medusajs/icons"
import { Button, clx, DatePicker } from "@medusajs/ui"
import MedusaRadio from "@modules/common/components/radio"
import ReactCountryFlag from "react-country-flag"
import { countries } from "@lib/data/countries"

import { convertToLocale } from "@lib/util/money"
import { setShippingMethod } from "@lib/data/cart"
import { getDeliveryMinDate, getStandardDeliverySlots, getTimeSpecificSlots } from "@lib/util/delivery-rules"

import ErrorMessage from "@modules/checkout/components/error-message"
import TimePicker from "@modules/common/components/time-picker"
import CardMessageGenerator from "@modules/ai/card-message-generator"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const DeliveryDetails: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingPrices, setIsLoadingPrices] = useState(true)

    const [shippingMethodId, setShippingMethodId] = useState<string | null>(
        cart.shipping_methods?.at(-1)?.shipping_option_id || null
    )

    // Initialize deliveryDate based on the selected shipping method's rules
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(() => {
        const initialOption = availableShippingMethods?.find(sm => sm.id === (cart.shipping_methods?.at(-1)?.shipping_option_id || null))
        // @ts-ignore
        return getDeliveryMinDate(initialOption?.type?.code)
    })

    const [deliveryTime, setDeliveryTime] = useState("")
    const [showGenerator, setShowGenerator] = useState(false);

    const [calculatedPricesMap, setCalculatedPricesMap] = useState<
        Record<string, number>
      >({})

    const [error, setError] = useState<string | null>(null)

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const isOpen = true; // Forza l'apertura del modulo di metodo di consegna per il test
    //const isOpen = searchParams.get("step") === "delivery"


    const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
    )

    const [deliveryDetails, setDeliveryDetails] = useState({
      firstName: '',
      lastName: '',
      recipientPhone: '',
      message: '', // Aggiunto campo per il messaggio
      signature: '', // 1. Aggiunto campo per la firma
      notes: ''
    });

    // Phone logic
    const [query, setQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === "IT") || countries[0])
    const [phoneNumber, setPhoneNumber] = useState("")

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

    // Update deliveryDetails when phone parts change
    useEffect(() => {
        const fullPhone = `${selectedCountry.dial_code}${phoneNumber}`
        setDeliveryDetails(prev => {
            if (prev.recipientPhone !== fullPhone) {
                return { ...prev, recipientPhone: fullPhone }
            }
            return prev
        })
    }, [selectedCountry, phoneNumber])



    const handleDeliveryDetailsChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setDeliveryDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    };

    // Funzione per aggiornare il messaggio dallo stato del generatore AI
    const handleMessageChange = (generatedMessage: string) => {
      setDeliveryDetails((prevDetails) => ({
        ...prevDetails,
        message: generatedMessage,
      }));
    };

    const handleSetShippingMethod = async (
        id: string,
            //variant: "shipping" | "pickup"
            variant: "shipping"
        ) => { 
        
        setError(null)

        let currentId: string | null = null
        setIsLoading(true)
        setShippingMethodId((prev) => {
            currentId = prev
            return id
        })

        await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
            .catch((err) => {
            setShippingMethodId(currentId)
        
                setError(err.message)
              })
              .finally(() => {
                setIsLoading(false)
              })

    }


    const handleEdit = () => {
        router.push(pathname + "?step=delivery", { scroll: false })
    }

    const handleSubmit = () => {
        router.push(pathname + "?step=billing", { scroll: false })
    }


    useEffect(() => {
        setError(null)
    }, [isOpen])


    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 30)

    // Helper per determinare le opzioni di consegna in base al metodo selezionato
    const selectedShippingOption = availableShippingMethods?.find(
      (sm) => sm.id === shippingMethodId
    )

    // @ts-ignore
    const minDate = getDeliveryMinDate(selectedShippingOption?.type?.code)

    // Ensure deliveryDate is valid based on minDate
    useEffect(() => {
        if (deliveryDate) {
            const dDate = new Date(deliveryDate)
            dDate.setHours(0,0,0,0)
            
            const mDate = new Date(minDate)
            mDate.setHours(0,0,0,0)
            
            if (dDate.getTime() < mDate.getTime()) {
                setDeliveryDate(minDate)
            }
        } else {
            setDeliveryDate(minDate)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDate.toDateString(), deliveryDate?.toDateString(), selectedShippingOption?.id])

    // Reset delivery time when date or method changes
    useEffect(() => {
        setDeliveryTime("")
    }, [deliveryDate, shippingMethodId])

    // 2. Rimossa la logica di stato duplicata (localMessage, isSavingLocally)

    return (
          <div className="bg-white min-h-[400px]">
            <div className="mb-6">
               <h2 className="text-center">
                 Consegna
              </h2>
              <h3 className="text-center my-2 h4-style">
                Scegli come e quando desideri inviare il tuo ordine
              </h3>


            {isOpen &&
            cart?.shipping_address &&
            cart?.billing_address &&
            cart?.email && (
                
                <button
                    onClick={handleEdit}
                    className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                    data-testid="edit-delivery-button"
                >
                    Edit
                </button>
                
            )}

            {isOpen ? (

            <div className="mt-4">
              {/* Dettagli destinatario e metodo di consegna */}
              <div className="mb-10">
              
                <div className="flex flex-col">
                  <span className="text-large-semi">
                    Dati destinatario (Chi riceve)
                  </span>
                  <span className="mb-4 text-ui-fg-muted txt-medium">
                    Inserisci i dati del destinatario per la consegna
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Nome Destinatario</label>
                        <input
                          type="text"
                          placeholder="Inserisci il nome"
                          name="firstName"
                          value={deliveryDetails.firstName}
                          onChange={handleDeliveryDetailsChange}
                          required
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                          />
                      </div>
                      <div>
                                <label className="block text-xs text-gray-500 mb-1">Cognome Destinatario</label>
                                <input
                                  type="text"
                                  placeholder="Inserisci il cognome"
                                  name="lastName"
                                  value={deliveryDetails.lastName}
                                  onChange={handleDeliveryDetailsChange}
                                  required
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Telefono Destinatario</label>
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
                      {/* Campo Messaggio Aggiunto */}
                       {!showGenerator && (
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Testo biglietto</label>
                        <textarea
                          name="message"
                          value={deliveryDetails.message}
                          onChange={handleDeliveryDetailsChange}
                          placeholder="Inserisci il tuo messaggio da inviare insieme ai fiori"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                          rows={3}
                        />
                         <div className="text-center text-md">Altrimenti...</div>
                      </div>

                      )}
                     
                      {!showGenerator && (
                        <div className="col-span-2 text-center">
                          <button
                            onClick={() => setShowGenerator(true)}
                            className="text-center w-full p-3 border border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50"
                          >
                            <span className="font-semibold text-theme-accent">Lasciati ispirare dalla nostra <strong>Flora AI</strong> per generare il messaggio.</span>
                          </button>
                        </div>
                      )}

                      {/* Il generatore viene mostrato condizionalmente */}
                      {showGenerator && (
                        <div className="col-span-2 mt-4">
                          <CardMessageGenerator 
                            currentMessage={deliveryDetails.message}
                            onMessageChange={handleMessageChange}
                            isSaving={isLoading} // Puoi collegarlo allo stato di caricamento principale se necessario
                          />
                          {/* 2. Aggiunto link per nascondere il generatore */}
                          <div className="text-right mt-2">
                            <button
                              onClick={() => setShowGenerator(false)}
                              className="text-xs text-ui-fg-muted hover:text-ui-fg-subtle"
                            >
                              Nascondi Flora AI
                            </button>
                          </div>
                        </div>
                      )}
                      {/* 2. Aggiunto campo per la firma */}
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-500 mb-1">Firma (lascia vuoto per rimanere anonimo)</label>
                        <input
                          type="text"
                          placeholder="Firma il tuo biglietto (es. Con affetto, Mario)"
                          name="signature"
                          value={deliveryDetails.signature}
                          onChange={handleDeliveryDetailsChange}
                          className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                        />
                      </div>
                </div>

              </div>

             {/* Dettagli metodo di consegna */}
              <div className="mb-10">
                <div className="flex flex-col">
                   <span className="text-large-semi">
                      Metodo di consegna
                    </span>
                    <span className="mb-4 text-ui-fg-muted txt-medium">
                      Scegli un metodo di consegna per il tuo ordine
                    </span>
                </div>
                <div data-testid="delivery-options-container" className="flex flex-row gap-x-4">
                          <div className="w-1/2">

                              <RadioGroup
                                  value={shippingMethodId}
                                  onChange={(v) => handleSetShippingMethod(v, "shipping")} >
                                        {_shippingMethods?.map((option) => {
                                          const isDisabled =
                                            option.price_type === "calculated" &&
                                            !isLoadingPrices &&
                                            typeof calculatedPricesMap[option.id] !== "number"
                      
                                          return (
                                            <Radio
                                              key={option.id}
                                              value={option.id}
                                              data-testid="delivery-option-radio"
                                              disabled={isDisabled}
                                              className={clx(
                                                "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                                                {
                                                  "border-ui-border-interactive":
                                                    option.id === shippingMethodId,
                                                  "hover:shadow-brders-none cursor-not-allowed":
                                                    isDisabled,
                                                }
                                              )}
                                            >
                                              <div className="flex flex-col items-left gap-x-4">
                                                <MedusaRadio
                                                  checked={option.id === shippingMethodId}
                                                />
                                                <div className="text-base-semi  ">
                                                  {option.name} 
                                                </div>
                                                <div className="text-small-regular">
                                                  {option.type.description || ""} 
                                                </div>
                                              </div>
                                              <span className="justify-self-end text-ui-fg-base">
                                                {option.price_type === "flat" ? (
                                                  convertToLocale({
                                                    amount: option.amount!,
                                                    currency_code: cart?.currency_code,
                                                  })
                                                ) : calculatedPricesMap[option.id] ? (
                                                  convertToLocale({
                                                    amount: calculatedPricesMap[option.id],
                                                    currency_code: cart?.currency_code,
                                                  })
                                                ) : isLoadingPrices ? (
                                                  <Loader />
                                                ) : (
                                                  "-"
                                                )}
                                              </span>
                                            </Radio>
                                          )
                                        })}
                              </RadioGroup>
                          </div>
                          <div className="w-1/2 p-4 border border-gray-200 rounded-lg">
                              <div className="flex flex-col gap-y-6">
                                  <div>
                                      <label htmlFor="delivery-date" className="block text-sm font-medium text-ui-fg-base mb-2">
                                          Data di consegna
                                      </label>
                                      <DatePicker
                                          aria-label="Seleziona la data di consegna"
                                          granularity="day"
                                          minValue={minDate}
                                          value={deliveryDate}
                                          onChange={setDeliveryDate}
                                          maxValue={maxDate}
                                          className="py-1"
                                      />
                                  </div>
                                  
                                  {/* Render logic based on shipping type */}
                                  {(() => {
                                    // @ts-ignore
                                    const code = selectedShippingOption?.type?.code

                                    if (code === 'STD') {
                                        const slots = getStandardDeliverySlots(deliveryDate)
                                        return (
                                            <div>
                                                <label className="block text-sm font-medium text-ui-fg-base mb-2">
                                                    Fascia Oraria
                                                </label>
                                                {slots.length > 0 ? (
                                                    <select
                                                        value={deliveryTime}
                                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                    >
                                                        <option value="" disabled>Seleziona fascia oraria</option>
                                                        {slots.map(slot => (
                                                            <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <div className="text-sm text-red-500">Nessuna fascia oraria disponibile per oggi.</div>
                                                )}
                                            </div>
                                        )
                                    } else if (code === 'EXP') {
                                        const now = new Date()
                                        const isToday = deliveryDate?.toDateString() === now.toDateString()
                                        
                                        let deliveryTimeExp = new Date(deliveryDate || now)
                                        
                                        if (isToday) {
                                            const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)
                                            const startOfService = new Date(now)
                                            startOfService.setHours(10, 0, 0, 0)
                                            
                                            if (twoHoursLater < startOfService) {
                                                deliveryTimeExp.setHours(10, 0, 0, 0)
                                            } else {
                                                deliveryTimeExp = twoHoursLater
                                            }
                                        } else {
                                            deliveryTimeExp.setHours(10, 0, 0, 0)
                                        }

                                        const formattedTime = deliveryTimeExp.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                                        
                                        return (
                                            <div className="text-sm text-ui-fg-base mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                                                <span className="font-semibold">Consegna Express:</span> La consegna sarà effettuata entro le: {formattedTime}
                                            </div>
                                        )
                                    } else if (code === 'TSS') {
                                        const timeSlots = getTimeSpecificSlots(code, deliveryDate)

                                        return (
                                            <div>
                                                <label className="block text-sm font-medium text-ui-fg-base mb-2">
                                                    Orario di consegna (Time Specific)
                                                </label>
                                                <select
                                                    value={deliveryTime}
                                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                                >
                                                    <option value="" disabled>Seleziona orario</option>
                                                    {timeSlots.map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )
                                    } else {
                                        // Fallback for unknown types
                                        return (
                                            <TimePicker
                                                label="Orario di consegna"
                                                value={deliveryTime}
                                                onChange={(e) => setDeliveryTime(e.target.value)}
                                            />
                                        )
                                    }
                                  })()}
                              </div>
                          </div>
                </div>
              </div>
              
              {/* Annotazioni */}
              <div className="mb-6">
                <div className="md:col-span-2">

                  <div className="flex flex-col">
                          <span className="text-large-semi">
                              Annotazioni
                          </span>
                          <span className="mb-4 text-ui-fg-muted txt-medium">
                             Riportare note per la consegna, es. orari preferiti, dettagli accesso, ecc.
                          </span>
                      </div>

                
                  <textarea
                    name="notes" // Questo è solo per il controllo UI
                    value={deliveryDetails.notes}
                    onChange={handleDeliveryDetailsChange}
                    placeholder="Note per la consegna"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                    rows={3}
                    />
                </div>
              </div>

              {/* Button */}
              <div className="">
                      <ErrorMessage error={error} data-testid="delivery-option-error-message"/>
                      <Button
                          size="large"
                          className="mt-6 shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base text-white hover:text-white"
                          onClick={handleSubmit}
                          isLoading={isLoading}
                          disabled={!cart.shipping_methods?.[0]}
                          data-testid="submit-delivery-option-button"
                          >
                              Continua
                      </Button>
              </div>
            </div>

            ):(

                <div>
                    <div className="text-small-regular">
                         {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                            <div className="flex flex-col w-1/3">
                                <span> 
                                    Method
                                </span>
                                <span className="txt-medium text-ui-fg-subtle">
                                    {cart.shipping_methods?.at(-1)?.name}{" "}
                                    {convertToLocale({
                                        amount: cart.shipping_methods?.at(-1)?.amount!,
                                        currency_code: cart?.currency_code,
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )
            }




            </div>
          </div>

    )
}
export default DeliveryDetails