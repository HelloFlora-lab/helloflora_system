import { HttpTypes } from "@medusajs/types"
import Divider from "@modules/common/components/divider"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type DisclaimerProps = {
  region: HttpTypes.StoreRegion
  countryCode?: string
}

const ProductDisclaimer: React.FC<DisclaimerProps> = ({ region, countryCode }) => {

  

  return (
    <div className="">
       
        <p className="text-small-regular ">
         <strong>NB.</strong> In fase d'ordine è possibile indicare una preferenza cromatica: <strong>faremo il possibile per rispettare le vostre scelte</strong>, utilizzando fiori freschi e di stagione disponibili al momento.
          Tuttavia, trattandosi di un prodotto naturale e fresco, alcune varietà o colori potrebbero non essere reperibili in giornata. In questi casi:
        </p>
        
            <div className="mt-2 text-small-regular text-theme-text-base">
              La composizione verrà realizzata con fiori misti e armoniosi, mantenendo lo stile e lo spirito del design scelto;
            </div>  
            <div className="mt-2 text-small-regular text-theme-text-base">
              Garantiamo sempre un risultato equilibrato e raffinato, fedele all’atmosfera desiderata;
            </div>
            <div className="mt-2 text-small-regular text-theme-text-base">
              La preferenza colore rimane un orientamento, non una riproduzione identica alla foto.
            </div>
        
    </div>

  )
}
export default ProductDisclaimer