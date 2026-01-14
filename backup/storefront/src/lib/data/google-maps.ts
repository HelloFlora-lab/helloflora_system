
export interface DeliveryStatus {
  message: string;
  color: string;
  distance: string;
}

export interface AddressDetails {
  street: string;
  postalCode: string;
  city: string;
  province: string; // Aggiungi la provincia
  country: string;
}

// --- NUOVA FUNZIONE HELPER per non ripetere il codice ---
function parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): AddressDetails {
  let street = '';
  let streetNumber = '';
  let postalCode = '';
  let city = '';
  let province = ''; // Aggiungi la variabile
  let country = '';

  for (const component of components) {
    const types = component.types;
    if (types.includes('route')) street = component.long_name;
    if (types.includes('street_number')) streetNumber = component.long_name;
    if (types.includes('postal_code')) postalCode = component.long_name;
    if (types.includes('locality')) city = component.long_name;
    // Estrai la provincia (sigla)
    if (types.includes('administrative_area_level_2')) province = component.short_name; 
    if (!city && types.includes('administrative_area_level_3')) city = component.long_name;
    if (types.includes('country')) country = component.long_name;
  }

  return {
    street: streetNumber ? `${street}, ${streetNumber}` : street,
    postalCode,
    city,
    province, // Ritorna la provincia
    country,
  };
}

// --- NUOVA FUNZIONE per la geocodifica inversa ---
export const reverseGeocode = async (coords: { lat: number; lng: number }): Promise<{ details: AddressDetails; formattedAddress: string } | null> => {
  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: coords });

    if (response.results && response.results[0]) {
      const place = response.results[0];
      const details = parseAddressComponents(place.address_components);
      return {
        details,
        formattedAddress: place.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};


export const initializeGoogleMaps = async (
  inputElement: HTMLInputElement,
  checkFloristDistance: (coords: { lat: number; lng: number }, details?: AddressDetails) => void,
  setStatus: (status: DeliveryStatus) => void,
  countryCode: string = 'it'
) => {
  try {
    if (!window.google) {
        console.error("Google Maps JavaScript API not loaded");
        return;
    }

    // Uso della nuova API funzionale: window.google.maps.importLibrary()
    await (window as any).google.maps.importLibrary('maps');
    
    const places = await (window as any).google.maps.importLibrary('places') as any;
    const Autocomplete = places.Autocomplete;
    
    if (inputElement) {
      const autocomplete = new Autocomplete(inputElement, {
        types: ['address'],
        componentRestrictions: { country: countryCode }, // <--- Usa il parametro qui
        // IMPORTANTE: Aggiungi 'address_components' ai campi richiesti
        fields: ['geometry', 'formatted_address', 'address_components'] 
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.geometry?.location && place.address_components) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          // Usiamo la nuova funzione helper
          const details = parseAddressComponents(place.address_components);

          checkFloristDistance({ lat, lng }, details);

        } else {
          setStatus({ message: 'Indirizzo non valido.', color: 'red', distance: 'N/A' });
        }
      });
    }
  } catch (error) {
    console.error("Errore Google Maps:", error);
    setStatus({ message: "Impossibile caricare le Mappe.", color: 'red', distance: 'N/A' });
  }
};