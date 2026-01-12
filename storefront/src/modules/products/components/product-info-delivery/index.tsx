'use client'
import { useTheme } from "@lib/context/theme-context"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type InfoDeliveryProps = {
  region: HttpTypes.StoreRegion
  countryCode?: string
}

const InfoDelivery: React.FC<InfoDeliveryProps> = ({ region, countryCode }) => {

  const { theme } = useTheme();

  return (
    <>
    <p className="text-center py-2">Visualizza{' '}
        <LocalizedClientLink href="/information/terms-conditions" className="underline font-bold" target="_blank" title="Prendi visione dei nostri termini e condizioni">Termini e condizioni</LocalizedClientLink>
      </p>
       <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 px-4">
                        {[
                            {
                            img: `/images/features/feature_${theme}-01.png`,
                            title: "Creazioni uniche",
                            
                            },
                            {
                            img: `/images/features/feature_${theme}-04.png`,
                            title: "Fiori freschi",
                            
                            },
                             {
                            img: `/images/features/feature_${theme}-02.png`,
                            title: "Consegna garantita e personalizzata",
                      
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
                                <h4 className="text-small-regular mb-2 items-center">{feature.title}</h4>
                                
                            </div>
                        ))}
                        </div>
    </>
  )
}
export default InfoDelivery