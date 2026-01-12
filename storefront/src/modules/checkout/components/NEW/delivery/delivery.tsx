"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import { RadioGroup, Radio } from "@headlessui/react"
import {  Loader, Clock } from "@medusajs/icons"
import { Button, clx, DatePicker } from "@medusajs/ui"
import MedusaRadio from "@modules/common/components/radio"

import { convertToLocale } from "@lib/util/money"
import { setShippingMethod } from "@lib/data/cart"

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

    // Modifica lo stato per usare un oggetto Date per il DatePicker
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(new Date())
    const [deliveryTime, setDeliveryTime] = useState("")

    // 1. Aggiunto stato per controllare la visibilità del generatore
    const [showGenerator, setShowGenerator] = useState(false);

    const [calculatedPricesMap, setCalculatedPricesMap] = useState<
        Record<string, number>
      >({})


    const [error, setError] = useState<string | null>(null)


    const [shippingMethodId, setShippingMethodId] = useState<string | null>(
        cart.shipping_methods?.at(-1)?.shipping_option_id || null
    )


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
        router.push(pathname + "?step=payment", { scroll: false })
    }


    useEffect(() => {
        setError(null)
    }, [isOpen])


    const today = new Date()
    const maxDate = new Date()
    maxDate.setDate(today.getDate() + 30)

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
                    Dati destinatario
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
                                <input
                                  type="tel"
                                  placeholder="Inserisci il telefono"
                                  name="recipientPhone" // Questo è solo per il controllo UI
                                  value={deliveryDetails.recipientPhone}
                                  onChange={handleDeliveryDetailsChange}
                                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
                                />
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
                      </div>
                      )}
                      {/* 1. Rimuovo la textarea duplicata. Ora solo il pulsante viene mostrato quando il generatore è nascosto. */}
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
                                          minValue={today}
                                          value={deliveryDate}
                                          onChange={setDeliveryDate}
                                          maxValue={maxDate}
                                          className="py-1"
                                      />
                                  </div>
                                  <TimePicker
                                    label="Orario di consegna"
                                    value={deliveryTime}
                                    onChange={(e) => setDeliveryTime(e.target.value)}
                                  />
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