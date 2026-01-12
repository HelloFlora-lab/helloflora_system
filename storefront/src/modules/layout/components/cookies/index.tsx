
'use client';
import { Text } from "@medusajs/ui"
import { useState, useEffect } from 'react';
import { hasCookie, setCookie } from 'cookies-next'; // Using a library like cookies-next is helpful


const CookiesConsent = () => {
    

     const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if the consent cookie is already set on the client
    if (!hasCookie('localConsent')) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookie = () => {
    // Set the consent cookie in the user's browser
    setCookie('localConsent', 'true', { maxAge: 60 * 60 * 24 * 365 }); // Expires in 1 year
    setShowConsent(false);
    // You might also trigger analytics initialization here
  };

  const declineCookie = () => {
    // Set consent cookie to false/denied or delete tracking cookies
    setCookie('localConsent', 'false', { maxAge: 60 * 60 * 24 * 365 });
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }



  return (
     <div className="fixed bottom-0 left-0 right-0 bg-theme-accent text-white p-4 flex justify-between items-center shadow-lg">
      <p>
       Utilizziamo i cookie per migliorare la tua esperienza di navigazione, per analizzare il traffico del sito e per finalità di marketing. Continuando accetti l'uso di tutti i cookie, a meno che tu non personalizzi. Per ulteriori informazioni consulta la nostra <a href="/it/information/privacy-policy" className="underline">Politica sulla Privacy</a>.
      </p>
      <div className="flex gap-4">
        <button
          onClick={declineCookie}
          className="inline-flex items-center justify-center rounded-2xl border border-transparent px-7 py-3 text-center text-base bg-theme-main hover:bg-transparent hover:border-white font-medium text-white transition hover:text-white"
        >
          Declina
        </button>
        <button
          onClick={acceptCookie}
          className="inline-flex items-center justify-center rounded-2xl border border-transparent px-7 py-3 text-center text-base bg-theme-secondary hover:border-white hover:bg-transparent font-medium text-white transition hover:text-white"
        >
          Accetta
        </button>
      </div>
    </div>
  )
}

export default CookiesConsent
