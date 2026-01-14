"use client";

import { useTheme } from "@lib/context/theme-context";
import { Button, clx } from "@medusajs/ui";
import React, { useState, useEffect, useRef } from "react";
import IconAIAgent from "./icon-agent";
import LoaderIcon from "@modules/common/icons/loader";

type GenerationOptions = {
  relationship: string;
  occasion: string;
  tone: string;
};

interface CardMessageGeneratorProps {
  currentMessage: string;
  onMessageChange: (message: string) => void;
  isSaving: boolean;
}

const MAX_CHARS = 300;

const CardMessageGenerator: React.FC<CardMessageGeneratorProps> = ({
  currentMessage,
  onMessageChange,
  isSaving,
}) => {
  const { theme } = useTheme();
  
  const [step, setStep] = useState(0); 

  const [options, setOptions] = useState<GenerationOptions>({
    relationship: "",
    occasion: "",
    tone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTextareaUnlocked, setIsTextareaUnlocked] = useState(!!currentMessage);
  
  // Usiamo useRef per evitare che useEffect si attivi al primo render
  const isInitialMount = useRef(true);
  
  const tones = ["Affettuoso", "Romantico", "Divertente", "Formale", "Amichevole", "Empatico"];

  const handleGenerate = async () => {
    // La funzione ora legge direttamente dallo stato 'options'
    if (!options.relationship || !options.occasion || !options.tone) {
      setError("Dati incompleti.");
      setStep(1);
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(4); // Vai allo step di caricamento

    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Invia direttamente lo stato 'options' che ora è garantito essere completo
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        // Se l'errore è 404, diamo un messaggio specifico
        if (response.status === 404) {
          throw new Error("Endpoint API non trovato. Controlla l'URL: /api/ai/generate-message");
        }
        throw new Error("Qualcosa è andato storto, riprova.");
      }

      const data = await response.json();

      if (!data.message) {
        throw new Error("La risposta dell'AI era vuota, riprova.");
      }

      onMessageChange(data.message);
      setIsTextareaUnlocked(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Si è verificato un errore sconosciuto.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. useEffect ora gestisce la chiamata a handleGenerate
  useEffect(() => {
    // Salta il primo render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Se tutti i parametri sono stati impostati, avvia la generazione
    if (options.relationship && options.occasion && options.tone) {
      handleGenerate();
    }
  }, [options]); // Si attiva ogni volta che lo stato 'options' cambia

  const handleChangeOptions = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Modificata per accettare una stringa direttamente, non un evento
  const handleToneSelect = (selectedTone: string) => {
    setOptions(prev => ({ ...prev, tone: selectedTone }));
  };

  const handleManualMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTextareaUnlocked) setIsTextareaUnlocked(true);
    onMessageChange(e.target.value);
  };

  // 1. Aggiunta una funzione per gestire il riavvio
  const handleRestart = () => {
    // Resetta lo stato delle opzioni ai valori iniziali
    setOptions({
      relationship: "",
      occasion: "",
      tone: "",
    });
    // Resetta anche eventuali errori
    setError(null);
    // Torna al primo step
    setStep(1);
  };

  // Funzione per renderizzare lo step corrente
  const renderStep = () => {
    switch (step) {
      // Step 0: Schermata iniziale
      case 0:
        return (
          <div className="text-center">
            <h4 className="h4-style mb-4 text-white">Personalizza il tuo biglietto con l'aiuto della nostra Esperta AI</h4>
            <Button onClick={() => setStep(1)} className="primary-btn">Inizia</Button>
          </div>
        );
      
      // Step 1: Relazione
      case 1:
        return (
          <div className="text-center flex flex-col items-center gap-4">
             <h4 className="mb-4 text-center text-white text-xl-semi">Per chi è il biglietto?</h4>
            <input
              name="relationship"
              placeholder="Es: mamma, partner, amico..."
              value={options.relationship}
              onChange={handleChangeOptions}
              className="w-full md:w-1/3 min-w-[100px] border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
              autoFocus
            />
            {/* Il pulsante ora ha una transizione per apparire */}
            <div className="h-10 w-full md:w-1/3 min-w-[100px]"> {/* Contenitore per evitare salti di layout e per la larghezza */}
              {options.relationship && (
                <Button 
                  onClick={() => setStep(2)} 
                  className="primary-btn animate-fade-in-up w-full"
                >
                  Prosegui
                </Button>
              )}
            </div>
          </div>
        );

      // Step 2: Occasione
      case 2:
        return (
          <div className="text-center flex flex-col items-center gap-4">
            <h4 className="mb-4 text-center text-white text-xl-semi">Qual è l'occasione?</h4>
            <input
              name="occasion"
              placeholder="Es: compleanno, anniversario..."
              value={options.occasion}
              onChange={handleChangeOptions}
              className="w-full md:w-1/3 min-w-[100px] border border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent"
              autoFocus
            />
            {/* Anche questo pulsante ha la transizione */}
            <div className="h-10 w-full md:w-1/3 min-w-[100px]"> {/* Contenitore per evitare salti di layout e per la larghezza */}
              {options.occasion && (
                <Button 
                  onClick={() => setStep(3)} 
                  className="primary-btn animate-fade-in-up w-full"
                >
                  Prosegui
                </Button>
              )}
            </div>
          </div>
        );

      // Step 3: Tono
      case 3:
        
        return (
          <div className="text-center flex flex-col items-center gap-4 w-full">
             <h4 className="mb-4 text-center text-white text-xl-semi">Scegli il tono del messaggio</h4>
             <div className="flex flex-wrap justify-center gap-3">
                {tones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleToneSelect(tone)}
                    className={clx(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                      options.tone === tone
                        ? "bg-theme-accent text-white border-theme-accent scale-105"
                        : "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                  >
                    {tone}
                  </button>
                ))}
             </div>
          </div>
        );

      // Step 4: Caricamento e Risultato
      case 4:
        return (
          <div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48">
               <LoaderIcon className="animate-spin" size={32} fill="white" />
                <h4 className="mb-4 text-center h3-style text-white">Sto creando la magia...</h4>
              </div>
            ) : error ? ( // 4. Mostra un messaggio di errore se presente
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                {/* Usa handleRestart anche qui per coerenza */}
                <Button onClick={handleRestart}>Riprova</Button>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center gap-4">
                <textarea
                  id="gift-note-ai"
                  value={currentMessage}
                  onChange={handleManualMessageChange}
                  maxLength={MAX_CHARS}
                  rows={4}
                  className="w-full md:w-1/2 min-w-[150px] min-h-[140px] border text-small-regular border-gray-200 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-theme-accent disabled:bg-gray-100"
                  placeholder="Messaggio generato..."
                  disabled={isSaving}
                  spellCheck="false"
                  autoCorrect="off"
                  autoComplete="off"
                />
                <p className="text-xs text-gray-500 flex justify-end">
                  {currentMessage.length} / {MAX_CHARS} caratteri
                </p>
                {/* 2. Usa la nuova funzione handleRestart nell'onClick */}
                <button onClick={handleRestart} className="text-xs hover:text-ui-fg-subtle mt-1">Ricomincia</button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative p-4 rounded-lg bg-theme-secondary-light outline-2 outline-offset-4 outline-dashed outline-gray-200">
      {/* 1. Modificato il contenitore per la nuova dimensione e posizione */}
      <div className="absolute w-[150px] left-1/2 -top-[75px] z-10 -translate-x-1/2 transform">
                <img
                  data-src-template={`/images/features/flora_ai_${theme}.png`}
                  data-src-default="/images/features/flora_ai_default.png"
                  src={`/images/features/flora_ai_${theme}.png`}
                  alt="shape image"
                  loading="eager"
                  className="w-full h-auto"
                />
            </div>
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none z-0"
        style={{
           background: "linear-gradient(270deg, #FFB5DE, #96A0FF, #EF4A00, #DB304D)",
          backgroundSize: "600% 600%",
          animation: "gradientBorderMove 8s ease infinite",
        }}
      />
      {/* Bordo tratteggiato esterno con offset */}
      
        <div className="relative z-10 mt-4 min-h-[230px] flex flex-col justify-center">
          <div className="text-center">
            <h3 className="h2-style font-semibold mb-2"><IconAIAgent alt="AI Agent Icon" size={32} /> Flora AI</h3>
          </div>
          {renderStep()}
        </div>
    </div>
  );
};

export default CardMessageGenerator;