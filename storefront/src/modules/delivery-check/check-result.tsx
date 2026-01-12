'use client';

import Check from "@modules/common/icons/check";
import Question from "@modules/common/icons/question";
import Xmark from "@modules/common/icons/xmark";
import { useState } from "react";


interface DeliveryStatus {
  message: string;
  color: 'green' | 'yellow' | 'red';
  distance: string;
  //yflorists: Florist[]; 
}


const colorMap = {
  green: '#3FB34F', 
  yellow: '#ED6E20',
  red: '#EB292E',
};

const CheckResult = ({
    message,color,distance
}: DeliveryStatus) => {
    

  
    switch (color) {
      case 'green':

        return (
          <div className="flex items-center justify-between w-full p-4 rounded-md shadow-md space-x-3 transition-colors duration-300 text-white" style={{ backgroundColor: colorMap[color], /*color: color === 'yellow' ? '#fff' : '#fff'*/ }}>
            <div className="flex items-start space-x-4">
              <span className="text-3xl"><Check fill="white" size="64" /></span>
              <div>
                <p className="font-semibold uppercase">Il servizio è disponibile nella tua zona</p>
                <p className="text-small-regular pt-2">Procedi con il tuo ordine, verrà consegnato con il nostro<br /> <strong className="uppercase">servizio rapido</strong></p>
                {/*<p className="text-sm opacity-80">{distance}</p>*/}
              </div>
            </div>

            <button
              className="h-10 px-4 rounded-2xl border border-white bg-transparent text-white hover:bg-theme-accent hover:border-theme-accent hover:text-white font-medium"
              aria-label="Ordina ora"
            >
              Ordina
            </button>
          </div>
        );


      case 'yellow':
        return (
           <div className="flex items-center justify-between w-full p-4 rounded-md shadow-md space-x-3 transition-colors duration-300 text-white" style={{ backgroundColor: colorMap[color] }}>
            <div className="flex items-start space-x-4">
              <span className="text-3xl"><Question fill="white" size="64" /></span>
              <div>
                <p className="font-semibold uppercase">Verifica Manuale Necessaria</p>
                <p className="text-small-regular pt-3">L'area richiede una conferma di disponibilità in tempo reale. Premi il bottone <strong>"Supporto"</strong> per chattare con un nostro operatore che completerà subito il controllo per te.</p>
                {/*<p className="text-sm opacity-80">{distance}</p>*/}
              </div>
            </div>

            <button
              className="h-10 px-4 rounded-2xl border border-white bg-transparent text-white hover:bg-theme-accent hover:border-theme-accent hover:text-white font-medium"
              aria-label="Supporto"
            >
              Supporto
            </button>
          </div>
        );

      case 'red':
        return (
           <div className=" items-center justify-between w-full p-4 rounded-md shadow-md space-x-3 transition-colors duration-300 text-white" style={{ backgroundColor: colorMap[color] }}>
            <div className="flex items-start space-x-4">
              <span className="text-3xl"><Xmark fill="white" size="64" /></span>

              <div className="text-left">
                <p className="font-semibold uppercase">Servizio Non Ancora Disponibile nella Tua Zona</p>
                <p className="text-small-regular pt-3">Il tuo indirizzo si trova momentaneamente al di fuori della nostra area di consegna. <strong className="uppercase">Non preoccuparti!</strong> Inserisci la tua email e ti avviseremo non appena il servizio sarà attivo nella tua zona, insieme a un <strong className="uppercase">codice sconto</strong> per il tuo primo ordine.</p>
                <div className="flex items-center space-x-4 space-y-2 mt-4">
                    <input
                        type="email"   
                        placeholder="Inserisci la tua email"
                        className="flex-1 rounded-xl bg-white p-2 text-theme-text-accent outline-none placeholder-opacity-70"
                    />
                    <button
                    className="flex-none h-10 px-4 rounded-2xl border border-white bg-transparent text-white hover:bg-theme-accent hover:border-theme-accent hover:text-white font-medium"
                    aria-label="Invia"
                    >
                    Invia
                    </button>
                </div>
                {/*<p className="text-sm opacity-80">{distance}</p>*/}
              </div>
            </div>
            
          </div>
        );

      default:
        return (
          <div className="flex items-center space-x-4"></div>
        );
    }

  
}

export default CheckResult