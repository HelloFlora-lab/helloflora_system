"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/dist/client/components/navigation"
import { useActionState, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom/client";
import { setDeliveryAddresses } from "@lib/data/cart"

import { initializeGoogleMaps, DeliveryStatus, reverseGeocode } from '@lib/data/google-maps';
import { getFloristCheck } from "@lib/data/florists";
import { StoreFlorist } from "types/global";
import Marker from "@modules/common/icons/marker";
import CheckDeliveryAddress from "./check-delivery-address";
import { SubmitButton } from "../../submit-button";

const DeliveryCheck = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()


    const autocompleteRef = useRef<HTMLInputElement>(null);
    // Ref per il contenitore della mappa
    const mapRef = useRef<HTMLDivElement>(null);
    // NUOVO REF per memorizzare l'istanza del marker
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [address, setAddress] = useState<string>('');
    const [status, setStatus] = useState<DeliveryStatus | null>(null); 
    // Stato per salvare le coordinate
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const [message, formAction] = useActionState(setDeliveryAddresses, null)

    // NUOVO STATO: Dettagli indirizzo
    const [addressDetails, setAddressDetails] = useState({
      street: '',
      postalCode: '',
      city: '',
      province: '', // Aggiungi la provincia
      country: ''
    });

    // NUOVO STATO per i dati di consegna aggiuntivi
    const [deliveryDetails, setDeliveryDetails] = useState({
      firstName: '',
      lastName: '',
      recipientPhone: '',
      notes: ''
    });

    


    // NUOVO HANDLER per aggiornare i dati di consegna
    const handleDeliveryDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setDeliveryDetails(prev => ({
        ...prev,
        [name]: value
      }));
    };


    // Aggiorniamo la firma per accettare anche i dettagli (opzionale per ora)
    const checkFloristDistance = async (
      coords: { lat: number; lng: number }, 
      details?: { street: string, postalCode: string, city: string, province: string, country: string } // Aggiungi la provincia
    ) => {
        setIsLoading(true);
        setStatus(null);
        setCoordinates(coords);
        
        // Se i dettagli sono passati, aggiorniamo lo stato
        if (details) {
          setAddressDetails(details);
        }

         try {
              const response = await getFloristCheck({ lat: coords.lat, lng: coords.lng }) as StoreFlorist | null;
              if (response) {
                // Ensure color matches the expected union type

                const safeColor: 'green' | 'yellow' | 'red' =
                  response.color === 'green' || response.color === 'yellow' || response.color === 'red'
                    ? response.color
                    : 'red';
        
                setStatus({
                  message: response.message,
                  color: safeColor,
                  distance: response.distance.toString()
                });
              } else {
                const errMsg = 'Errore nella verifica.';
                setStatus({ message: errMsg, color: 'red', distance: 'N/A' });
              }
            } catch (error) {
              setStatus({ message: 'Errore di connessione al server.', color: 'red', distance: 'N/A' });
            } finally {
              setIsLoading(false);
            }

    };

    // Effect per renderizzare la mappa e gestire il drag & drop
    useEffect(() => {
      if (coordinates && mapRef.current && window.google) {
        const initMapInstance = async () => {
          const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
          const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

          const map = new Map(mapRef.current!, {
            center: coordinates,
            zoom: 15,
            mapId: "CHECKOUT_DELIVERY_MAP",
            disableDefaultUI: true,
            zoomControl: true,
            // Stili per una mappa minimale con solo le strade
            styles: [
              // Nasconde tutti i punti di interesse (negozi, ristoranti, ecc.)
              {
                featureType: "poi",
                stylers: [{ visibility: "off" }],
              },
              // Nasconde il trasporto pubblico (linee, fermate)
              {
                featureType: "transit",
                stylers: [{ visibility: "off" }],
              },
              // Nasconde elementi del paesaggio come parchi e aree naturali
              {
                featureType: "landscape",
                stylers: [{ visibility: "off" }],
              },
              // Nasconde le etichette amministrative (nomi di quartieri, ecc.)
              {
                featureType: "administrative",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
              // Mantiene visibili solo le geometrie e le etichette delle strade
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ visibility: "on" }],
              },
              {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
              },
            ],
          });

          const markerContainer = document.createElement("div");
          const root = ReactDOM.createRoot(markerContainer);
          // Sostituisci 'color' con 'className' per usare il colore del tema
          root.render(<Marker size={48} className="text-theme-accent" />);

          // Se esiste già un marker, lo rimuoviamo prima di crearne uno nuovo
          if (markerRef.current) {
            markerRef.current.map = null;
          }

          // Crea il nuovo marker e rendilo trascinabile
          const newMarker = new AdvancedMarkerElement({
            map: map,
            position: coordinates,
            content: markerContainer,
            title: "Indirizzo di consegna (trascinabile)",
            gmpDraggable: true, // <-- RENDE IL MARKER TRASCINABILE
          });

          // Aggiungi un listener per l'evento 'dragend'
          newMarker.addListener('dragend', async (event: google.maps.MapMouseEvent) => {
            const newCoords = {
              lat: event.latLng!.lat(),
              lng: event.latLng!.lng(),
            };
            
            setIsLoading(true);
            // Esegui la geocodifica inversa
            const geocodeResult = await reverseGeocode(newCoords);
            
            if (geocodeResult) {
              // Aggiorna l'input text con il nuovo indirizzo
              if (autocompleteRef.current) {
                autocompleteRef.current.value = geocodeResult.formattedAddress;
              }
              // Riesegui la verifica con i nuovi dati
              checkFloristDistance(newCoords, geocodeResult.details);
            } else {
              // Gestisci il caso in cui la geocodifica fallisce
              setStatus({ message: "Impossibile determinare l'indirizzo.", color: 'red', distance: 'N/A' });
              setIsLoading(false);
            }
          });

          // Salva la nuova istanza del marker nel ref
          markerRef.current = newMarker;
        };

        initMapInstance();
      }
    }, [coordinates]); // Questo effect si attiva quando le coordinate cambiano


    useEffect(() => {
        if (typeof window === 'undefined') return;
    
        if (window.google) {
            setMapLoaded(true);
            if(autocompleteRef.current) {
                // Passiamo 'it' come quarto parametro
                initializeGoogleMaps(autocompleteRef.current, checkFloristDistance, setStatus, 'it');
            }
            return;
        }
    
        const script = document.createElement('script');
        script.src = process.env.GOOGLE_MAPS_URL || `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&loading=async`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    
        // Funzione di callback globale
        window.initMap = () => {
            setMapLoaded(true);
            if(autocompleteRef.current) {
                // Passiamo 'it' anche qui
                initializeGoogleMaps(autocompleteRef.current, checkFloristDistance, setStatus, 'it');
            }
        };
    
        return () => {
          delete (window as any).initMap;
        };
      }, []); 

      
      // DEBUG: Stampa i dati nella console ogni volta che cambiano
      useEffect(() => {
        console.groupCollapsed("--- Debug Dati Consegna ---");
        console.log("Dettagli Indirizzo (da Google):", addressDetails);
        console.log("Dati Destinatario (da input):", deliveryDetails);
        console.log("Dati che verranno inviati (nascosti nel form):", {
            "shipping_address.address_1": addressDetails.street,
            "shipping_address.city": addressDetails.city,
            "shipping_address.postal_code": addressDetails.postalCode,
            "shipping_address.province": addressDetails.province,
            "shipping_address.country_code": cart?.region?.countries[0]?.iso_2 || 'it',
            "shipping_address.first_name": deliveryDetails.firstName,
            "shipping_address.last_name": deliveryDetails.lastName,
            "shipping_address.phone": deliveryDetails.recipientPhone,
            "metadata.notes": deliveryDetails.notes,
        });
        console.groupEnd();
      }, [addressDetails, deliveryDetails, cart]);


      
     return (
    <div className="bg-white min-h-[400px]">
        <div className="items-center mb-6">
            <h2 className="text-center">
                Verifica Indirizzo di Consegna
            </h2>
            <h3 className="text-center my-2 h4-style">
              Inserisci l'indirizzo di consegna utilizzando il campo sottostante
            </h3>
            
            <div className="w-full text-center">
              <div className="mb-4 rounded-xl bg-white p-3 ">
                
                <div className="flex w-full items-center justify-center text-center">
                  <input
                    ref={autocompleteRef}
                    type="text"
                    placeholder="(indirizzo, numero civico, città ...)"
                    onChange={(e) => setAddress(e.target.value)} 
                    disabled={!mapLoaded || isLoading}
                    className="rounded-xl text-center border h-10 w-1/2 bg-transparent px-5 py-3 text-theme-text-accent outline-none placeholder-opacity-70"
                  />
                 
                </div>
              </div>

              {isLoading && (
                <div className="text-center text-indigo-600 font-medium">
                   Verifica in corso ...
                </div>
              )}

              <div className="flex flex-col mt-4 mb-6 max-w-2xl mx-auto">
                {status && (
                  <CheckDeliveryAddress
                    message={status.message}
                    color={status.color}
                    distance={status.distance}
                  />
                )}
              </div>

              <div>
                  {/* Contenitore Mappa */}
                {coordinates && (
                  <div 
                    ref={mapRef} 
                    className="w-full h-[300px] rounded-xl shadow-md overflow-hidden border border-gray-200 mx-auto max-w-2xl"
                  />
                )}
              </div>

              

              {/* Mostra questo blocco solo se l'indirizzo è stato trovato */}
              {addressDetails.street && (
                <div>
                   <label className="block text-xs text-gray-500 mb-1">Indirizzo di Consegna</label>
                  <p className="text-lg font-medium mt-6 mb-4 max-w-2xl mx-auto">
                   {[addressDetails.street, addressDetails.city, addressDetails.province ? `(${addressDetails.province})` : null, addressDetails.postalCode].filter(Boolean).join(' - ')}
                  </p>

                  {/* UI per i dettagli dell'indirizzo come testo */}
                    <form action={formAction}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center max-w-2xl mx-auto">
                          {/* --- INPUT NASCOSTI PER I DATI DELL'INDIRIZZO --- */}
                          <input type="hidden" name="shipping_address.address_1" value={addressDetails.street} />
                          <input type="hidden" name="shipping_address.city" value={addressDetails.city} />
                          <input type="hidden" name="shipping_address.postal_code" value={addressDetails.postalCode} />
                          <input type="hidden" name="shipping_address.province" value={addressDetails.province} />
                          {/* Usiamo il country_code dalla regione del carrello, che è più affidabile */}
                          <input type="hidden" name="shipping_address.country_code" value={cart?.region?.countries[0]?.iso_2 || 'it'} />
                          
                          {/* Dati del destinatario per Medusa */}
                          <input type="hidden" name="shipping_address.first_name" value={deliveryDetails.firstName} />
                          <input type="hidden" name="shipping_address.last_name" value={deliveryDetails.lastName} />
                          <input type="hidden" name="shipping_address.phone" value={deliveryDetails.recipientPhone} />
                          

                      </div>
                      
                          
                      <div className="tesxt-center">
                        <SubmitButton className="mt-6 shadow-no rounded-2xl border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base text-white hover:text-white" data-testid="submit-address-button">
                          Conferma Indirizzo e Procedi
                        </SubmitButton>
                      </div>
                        
                  </form>
                </div>
              )}

            </div>
        </div>
    </div>

    )   


}
export default DeliveryCheck;