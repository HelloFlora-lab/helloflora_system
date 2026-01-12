'use client'
import React, { useState } from 'react';
import { useTheme } from "@lib/context/theme-context";
import { addNewsletterSubscription } from "@lib/data/newsletter";
import { toast, Toaster } from "@medusajs/ui";

const NewsletterCTA: React.FC = () => {

  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  // corrected: accept event and use async/await, validate email, show toast and reset state
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("[NewsletterCTA] Tentativo di invio del form...");

    if (!email || !email.trim()) {
      console.warn("[NewsletterCTA] Validazione fallita: l'email è vuota.");
      toast.error("Errore", {
        description: "Inserisci un'email valida.",
      });
      return;
    }

    const emailTrim = email.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailTrim)) {
      console.warn("[NewsletterCTA] Validazione fallita: formato email non valido.");
      toast.error("Errore", {
        description: "Formato email non valido.",
      });
      return;
    }

    setIsLoading(true);
    console.log(`[NewsletterCTA] Invio dell'email: ${emailTrim}`);

    try {
      const result = await addNewsletterSubscription({ email: emailTrim });
      console.log("[NewsletterCTA] Risultato ricevuto dalla API:", result);

      // flexible check: treat falsy result or explicit ok: false as failure
      const failed = result == null || (typeof result === "object" && result?.ok === false);

      if (failed) {
        console.error("[NewsletterCTA] La chiamata a addNewsletterSubscription è fallita. Risultato:", result);
        toast.error("Errore", {
          description: (result && result.message) ? result.message : "Errore durante l'iscrizione. Riprova più tardi.",
        });
      } else {
        // success
        const promo = result?.promoCode ?? result?.result?.promoCode ?? null;
        console.log(`[NewsletterCTA] Iscrizione avvenuta con successo. Codice promozionale: ${promo}`);
        toast.success("Iscritto", {
          description: promo ? `Iscrizione completata! Codice sconto: ${promo}` : "Iscrizione completata! Controlla la tua email.",
        });
        setEmail("");
      }
    } catch (err) {
      console.error("[NewsletterCTA] Errore catturato nel blocco catch:", err);
      toast.error("Errore", {
        description: "Errore di rete. Riprova più tardi.",
      });
    } finally {
      console.log("[NewsletterCTA] Fine del processo di invio. Impostazione di isLoading a false.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-theme-secondary mb-10">
      <div className="container  overflow-hidden mx-auto border-b border-gray-7/20 pb-10 pt-[70px] ">
        <div className="relative -mx-4 flex flex-wrap items-center">
          <div className="absolute -top-15 right-3 w-full max-w-[200px] p-3 max-2xl:hidden">
            <img
              data-src-template="/images/patterns/{theme}_1.png"
              data-src-default="/images/patterns/default_1.png"
              src={`/images/patterns/${theme}_2.png`}
              alt="shape image"
            />
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-5 w-full">
              <h3 className="sm:text-[28px] sm:leading-snug md:text-left text-center">
                Iscriviti alla <span className="text-theme-accent text-4xl">nostra Newsletter</span><br/>e Ricevi Subito 5€ di Sconto!
              </h3>
              <p className="text-theme-text-base md:text-left text-center">Non perdere le nostre novità floreali e le offerte esclusive. Iscriviti oggi alla nostra newsletter e ti invieremo immediatamente un codice sconto di 5€ da usare sul tuo prossimo ordine di fiori freschi.</p>
            </div>
          </div>

          <div className="w-full px-4 lg:w-1/2 md:items-start items-center">
            <div className="w-full">
              <form className="flex " onSubmit={handleSubmit}>
                <div className="relative mb-3 mr-5 w-full max-w-[350px]">
                  <div className="mb-8 rounded-xl bg-white p-3">
                    <div className="flex w-full justify-self-center">
                      <input
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Inserisci la tua email"
                        className="text-center h-8 w-full bg-transparent px-5 py-3 text-theme-text-accent outline-none placeholder-opacity-70"
                        aria-label="email"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-14 px-4 rounded-2xl border border-theme-accent bg-theme-accent text-white hover:bg-theme-secondary hover:border-theme-accent hover:text-white font-medium disabled:opacity-60"
                >
                  {isLoading ? "Invio..." : "Iscriviti"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default NewsletterCTA;