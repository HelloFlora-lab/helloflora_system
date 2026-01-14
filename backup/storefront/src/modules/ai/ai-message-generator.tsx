'use client';

import React, { useEffect, useState } from 'react';
import CardMessageGenerator from './card-message-generator';

const AIMessageGenerator = () => {

    const [localMessage, setLocalMessage] = useState<string>('Messaggio di default da modificare.');
    const [isSavingLocally, setIsSavingLocally] = useState<boolean>(false);

    // Funzione che gestisce il cambiamento e simula il salvataggio
    const handleMessageChange = (newMessage: string) => {
    setLocalMessage(newMessage); 

    // Avvia la simulazione di salvataggio
    setIsSavingLocally(true);
    
    // Simula la latenza di rete
    setTimeout(() => {
      console.log('Messaggio salvato (simulato):', newMessage);
      setIsSavingLocally(false);
    }, 50);
  };

 
return (

    <div className="content container mx-auto py-8">
        

       <CardMessageGenerator 
        currentMessage={localMessage}
        onMessageChange={handleMessageChange}
        isSaving={isSavingLocally}
      />

      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 hidden">
        <h3 className="font-semibold">Stato Attuale del Messaggio (Debug):</h3>
        <p className="whitespace-pre-wrap">{localMessage || '[Nessun messaggio]'}</p>
        <p className="text-sm text-gray-600">
          Stato di Salvataggio: {isSavingLocally ? 'IN CORSO...' : 'COMPLETATO'}
        </p>
      </div>

    </div>  
    
)

}
export default AIMessageGenerator;