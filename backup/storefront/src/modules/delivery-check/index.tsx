'use client';
import React, { useState, useRef, useEffect } from 'react';
import { getFloristCheck } from '@lib/data/florists';
import { StoreFlorist } from 'types/global';
import CheckResult from './check-result';
import { useTheme } from '@lib/context/theme-context';
// Importa la funzione e il tipo dal nuovo file
import { initializeGoogleMaps, DeliveryStatus } from '@lib/data/google-maps';

// Definizioni di tipo estese
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

const DeliveryCheck: React.FC = () => {

  const { theme } = useTheme();
  
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<DeliveryStatus | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Funzione per chiamare il Route Handler lato server
  // Definita prima dell'useEffect per essere passata correttamente
  const checkFloristDistance = async (coords: { lat: number; lng: number }) => {
    setIsLoading(true);
    setStatus(null);
        
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

  // Inietta lo script dell'API nel DOM
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google) {
        setMapLoaded(true);
        if(autocompleteRef.current) {
            initializeGoogleMaps(autocompleteRef.current, checkFloristDistance, setStatus);
        }
        return;
    }

    const script = document.createElement('script');
    script.src = process.env.GOOGLE_MAPS_URL  || '' // `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Funzione di callback globale
    window.initMap = () => {
        setMapLoaded(true);
        if(autocompleteRef.current) {
            initializeGoogleMaps(autocompleteRef.current, checkFloristDistance, setStatus);
        }
    };

    return () => {
      // Pulizia opzionale: rimuovere lo script potrebbe rompere altre parti se usano maps, 
      // ma rimuovere initMap è sicuro.
      delete (window as any).initMap;
    };
  }, []); 

  return (
    <div className="container mx-auto pb-10 pt-16">
      <section className="relative pb-[70px] bg-theme-secondary-light pt-[80px] rounded-xl">
        <div className="container">
          <div className="relative">

             <div className="absolute max-w-[90px] left-1/2 -top-[125px] z-10 -translate-x-1/2 transform p-3">
                <img
                  data-src-template={`/images/logo/icon_${theme}.png`}
                  data-src-default="/images/logo/icon_default.png"
                  src={`/images/logo/icon_${theme}.png`}
                  alt="shape image"
                  loading="eager"
                />
            </div>

            <div className="absolute -top-[70px] left-3 w-full max-w-[200px] p-3 max-xl:hidden">
                <img
                  data-src-template={`/images/patterns/${theme}_1.png`}
                  data-src-default="/images/patterns/default_1.png"
                  src={`/images/patterns/${theme}_1.png`}
                  alt="shape image"
                  loading="lazy"
                />
            </div>

            <div className="absolute -top-[70px] right-3  w-full max-w-[200px] p-3 max-xl:hidden"> 
                <img
                  data-src-template={`/images/patterns/${theme}_2.png`}
                  data-src-default="/images/patterns/default_2.png"
                  src={`/images/patterns/${theme}_2.png`}
                  alt="shape image"
                  loading="lazy"
                />
            </div>

            <div className="mx-auto w-full max-w-[590px] text-center">
              <h1 className="mb-4 text-3xl text-theme-text-accent lg:text-4xl">
               Verifica Subito la <br/> 
                  <span className="text-theme-accent">
                  Disponibilità
                </span>
              </h1>

              <p className="mx-auto mb-8 w-full max-w-[570px] text-base text-theme-text-base">
               In pochi secondi, puoi verificare se il tuo indirizzo è raggiunto dal nostro servizio di <strong>DELIVERY</strong> veloce e affidabile. Inserisci il tuo indirizzo qui sotto per scoprire la copertura nella tua zona e goderti i nostri fiori freschi consegnati direttamente a casa tua!
              </p>

              <div className="mb-8 rounded-xl bg-white p-3">
                <div className="flex w-full gap-3">
                  <input
                    ref={autocompleteRef}
                    type="text"
                    placeholder="Inserisci l'indirizzo di consegna"
                    onChange={(e) => setAddress(e.target.value)} 
                    disabled={!mapLoaded || isLoading}
                    className="text-center h-8 w-full bg-transparent px-5 py-3 text-theme-text-accent outline-none placeholder-opacity-70"
                  />
                 
                </div>
              </div>

              {isLoading && (
                <div className="text-center text-indigo-600 font-medium">
                   Verifica in corso ...
                </div>
              )}

              <div className="">
                {status && (
                  <CheckResult
                    message={status.message}
                    color={status.color}
                    distance={status.distance}
                  />
                )}
               
              </div>

            </div>

          </div>
        </div>
       
      </section>
    </div>
  )
}

export default DeliveryCheck
