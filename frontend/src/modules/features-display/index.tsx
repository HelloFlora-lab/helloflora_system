'use client';

import { useTheme } from "@lib/context/theme-context";

const FeaturesDisplay = () => {


    const { theme } = useTheme();

    return (
        <div className="container mx-auto pb-10 pt-10">
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

                    <div className="mx-auto w-full max-w-[590px] text-center">
                        <h2 className="mb-1">
                       Perchè acquistare fiori con  <strong className="text-theme-accent text-4xl"> HelloFlora</strong>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                        {[
                            {
                            img: `/images/features/feature_${theme}-01.png`,
                            title: "Creazioni uniche",
                            text: "Ogni composizione Helloflora è originale, pensata per raccontare emozioni autentiche. I nostri fioristi uniscono estetica e sentimento, dando vita a creazioni che parlano al cuore e rendono ogni momento speciale.",
                            },
                            {
                            img: `/images/features/feature_${theme}-02.png`,
                            title: "Consegna garantita e personalizzata",
                            text: "Scegli tu quando e dove: consegniamo con puntualità e attenzione, adattandoci alle tue esigenze. Perché ogni gesto floreale merita di arrivare nel momento perfetto, con cura e precisione.",
                            },
                            {
                            img: `/images/features/feature_${theme}-03.png`,
                            title: "Supporto Cliente",
                            text: "Siamo sempre al tuo fianco, con un servizio clienti attento e disponibile. Che tu abbia una domanda, un dubbio o una richiesta speciale, ti rispondiamo con gentilezza e soluzioni rapide.",
                            },
                            {
                            img: `/images/features/feature_${theme}-04.png`,
                            title: "Fiori freschi",
                            text: "Selezioniamo ogni fiore con cura, scegliendo solo quelli più freschi e profumati. La qualità è il nostro primo pensiero, per garantirti bellezza duratura e un’esperienza sensoriale che incanta.",
                            },
                        ].map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center px-2">
                               

                                <img
                                    data-src-template={feature.img}
                                    data-src-default={feature.img}
                                    src={feature.img}
                                    alt={feature.title}
                                    className="mb-4 w-45 h-45 object-contain"
                                    loading="lazy"
                                />
                                
                                <h3 className="mb-2">{feature.title}</h3>
                                <p className="text-base text-theme-text-base text-justify max-w-[340px] lg:max-w-[380px]">
                                    {feature.text}
                                </p>
                            </div>
                        ))}
                        </div>
                </div>
            </div>
            </section>
        </div>
    )

}
export default FeaturesDisplay