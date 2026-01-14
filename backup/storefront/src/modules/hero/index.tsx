'use client'
import React, { useState, useEffect, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroItem = {
  background: string
  title: string
  text: string
  button1: { label: string; href: string }
  button2?: { label: string; href: string }
  textPosition?: "left" | "center" | "right"
  BackGroundText?: boolean // 1. Aggiunta la nuova proprietà
}

const heroItems: HeroItem[] = [
  
  {
    background: "/images/hero/hero_artigianal_1.jpg",
    title: "<span class=\"text-theme-accent\">La Freschezza È Una Scelta. </span>L'Eccellenza, La Nostra Promessa.",
    text: "<div class=\"p-2\">Ogni fiore HelloFlora è curato e selezionato dai migliori artigiani floreali d'Italia. La composizione è originale, la materia prima è di qualità superiore e la consegna è gestita con la massima attenzione. Dalla coltivazione al tuo vaso, non lasciamo nulla al caso. Scegli l'originalità e la freschezza che durano.</div>",
    button1: { label: "Le nostre recensioni", href: "#review" },
    textPosition: "left",
    BackGroundText: true, // 2. Impostato a true
  },
  {
    background: "/images/hero/hero_autumn_1.jpg",
    title: " Ordina adesso i tuoi <span class=\"text-theme-accent\">Fiori preferiti</span> e rendi ogni momento speciale!",
    text: " Scopri la nostra vasta selezione di fiori freschi e <strong>Bouquette</strong> eleganti, perfetti per ogni occasione. Con consegna rapida e servizio personalizzato, realizziamo i tuoi desideri floreali per rendere ogni momento indimenticabile.",
    button1: { label: "Bouquette", href: "/categories/bouquet" },
    button2: { label: "Rose", href: "/categories/rose" },
    textPosition: "left",
    BackGroundText: false, // 2. Impostato a false per mostrare la differenza
  },
  {
    background: "/images/hero/hero_for_you_1.jpg",
    title: "Il regalo più bello <br/>è quello che ti fai. <br/><strong>Fiori per TE OGGI!</strong>",
    text: "La vera gioia non dovrebbe dipendere da un calendario o da qualcun altro. La tua casa, il tuo spazio, meritano di fiorire quando lo decidi tu. Scegli la freschezza e l'emozione di un bouquet, garantito e consegnato rapidamente, per celebrare l'unica persona che conta davvero: te",
    button1: { label: "Acquista ora", href: "/store" },
    button2: { label: "HelloFlora AI", href: "/hellofloraAI" },
    textPosition: "center",
    BackGroundText: false, // 2. Impostato a true
  },
]

const getTextPositionClasses = (pos: "left" | "center" | "right" = "center") => {
  switch (pos) {
    case "left":
      return "items-start text-left justify-center";
    case "right":
      return "items-end text-right justify-center";
    default:
      return "items-center text-center justify-center";
  }
}

const SLIDE_DURATION = 6000 // 6 secondi per slide
const UPDATE_INTERVAL = 50 // Aggiornamento fluido

const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const activeItem = heroItems[activeIdx]

  // Gestione Timer e Progresso
  useEffect(() => {
    if (isPaused) return

    const startTime = Date.now() - (progress / 100) * SLIDE_DURATION

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / SLIDE_DURATION) * 100

      if (newProgress >= 100) {
        setProgress(0)
        setActiveIdx((prev) => (prev === heroItems.length - 1 ? 0 : prev + 1))
      } else {
        setProgress(newProgress)
      }
    }, UPDATE_INTERVAL)

    return () => clearInterval(timer)
  }, [activeIdx, isPaused, progress]) // Dipendenze per riavviare correttamente

  // Reset progresso al cambio manuale
  const changeSlide = (idx: number) => {
    setActiveIdx(idx)
    setProgress(0)
  }

  const prevSlide = () => {
    changeSlide(activeIdx === 0 ? heroItems.length - 1 : activeIdx - 1)
  }

  const nextSlide = () => {
    changeSlide(activeIdx === heroItems.length - 1 ? 0 : activeIdx + 1)
  }

  // Calcolo circonferenza per SVG (r=10 -> C = 2*pi*r ≈ 62.83)
  const radius = 10
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex flex-col w-full">
      
      {/* SEZIONE IMMAGINE (Sopra) */}
      <div 
        className="relative w-full h-[60vh] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Sfondo immagine */}
        <img
          src={activeItem.background}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-500"
        />
        
        {/* Overlay scuro */}
        <div className="absolute inset-0 bg-black/10 z-0" />

        {/* Contenuto Testuale */}
        <div className={`container absolute inset-0 z-10 flex flex-col gap-6 px-6 py-10 small:p-32  ${getTextPositionClasses(activeItem.textPosition)}`}>
          {/* 3. Aggiunta logica condizionale per le classi dello sfondo */}
          <div className={`max-w-xl ${activeItem.BackGroundText ? 'bg-white/80 p-6 rounded-md shadow-md' : 'text-white'}`}>
            <h2 
              className="font-bold mb-4 drop-shadow-md"
              dangerouslySetInnerHTML={{ __html: activeItem.title }}
            />
            <p 
              className="text-lg md:text-xl mb-6 drop-shadow-md hidden small:block"
              dangerouslySetInnerHTML={{ __html: activeItem.text }}
            />
            <div className={`flex gap-6 flex-wrap ${getTextPositionClasses(activeItem.textPosition)}`}>
              <LocalizedClientLink 
                  className="primary-btn"
                  href={activeItem.button1.href}>
                  {activeItem.button1.label}
              </LocalizedClientLink>
              {activeItem.button2 && (
                <LocalizedClientLink
                      href={activeItem.button2.href}
                      className="secondary-btn">
                      {activeItem.button2.label}
                  </LocalizedClientLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEZIONE CONTROLLI (Sotto, fuori dall'immagine) */}
      <div className="w-full bg-white py-6 border-b border-gray-100">
        <div className="container mx-auto flex items-center justify-center gap-8">
          
          {/* Freccia Sinistra */}
          {/*}
            <button 
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Precedente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        */}
          {/* Indicatori Circolari con Progresso */}
          <div className="flex items-center gap-4">
            {heroItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => changeSlide(idx)}
                className="relative flex items-center justify-center w-8 h-8"
                aria-label={`Vai alla slide ${idx + 1}`}
              >
                {/* Cerchio di sfondo (sempre visibile) */}
                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIdx === idx ? 'bg-transparent' : 'bg-gray-300 hover:bg-gray-400'}`} />

                {/* SVG Progress Ring (Solo se attivo) */}
                {activeIdx === idx && (
                  <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
                    {/* Cerchio traccia sottile */}
                    <circle
                      cx="16"
                      cy="16"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    {/* Cerchio progresso animato */}
                    <circle
                      cx="16"
                      cy="16"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-theme-main transition-all duration-[50ms] ease-linear"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (progress / 100) * circumference}
                    />
                    {/* Punto centrale attivo */}
                    <circle cx="16" cy="16" r="3" className="fill-theme-main" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Freccia Destra */}
          {/* 
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Successivo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          */}
        </div>
      </div>
    </div>
  )
}

export default Hero