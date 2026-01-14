import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from 'next/image'
import { Text, clx } from "@medusajs/ui"
import Heart from "@modules/common/icons/heart";

const FooterBottom = () => {
  return (
<div className="mt-2 bg-theme-accent py-6 lg:mt-[20px]">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/3 lg:w-1/3">
              <div className="my-1 justify-center md:justify-start text-center md:text-left pt-1">
               
                  <Text className="txt-compact-small text-base text-gray-7">
                  © {new Date().getFullYear()} HelloFlora Store - All rights reserved 
                  </Text>
                  <Text className="txt-compact-small text-base text-gray-7">
                    &hearts; Tinklab LTD. Company number 16468278</Text>

              </div>
            </div>
            <div className="w-full px-4 md:w-1/3 lg:w-1/3 pt-1">
              <div className="my-1">
                <div className="-mx-3 flex flex-wrap items-center justify-center md:justify-end">
                   <LocalizedClientLink
                    href="/information/privacy-policy"
                    title="Privacy policy HelloFlora"
                    className="px-3 text-base text-gray-7 hover:text-white">
                    Privacy policy
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/information/terms-conditions"
                    title="Termini e condizioni HelloFlora"
                    className="px-3 text-base text-gray-7 hover:text-white">
                    Terms e condizioni
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/information/cookies-policy"
                    title="Cookies policy HelloFlora"
                    className="px-3 text-base text-gray-7 hover:text-white">
                    Cookies Policy
                  </LocalizedClientLink>
                </div>
              </div>
            </div>

          <div className="w-full px-4 md:w-1/3 lg:w-1/3">
            <Image
              src="/images/payment-info.png"
              width={462}
              height={35}
              alt="HelloFlora pagamenti accettati per i tuoi ordini"
              title="HelloFlora informazioni sui pagamenti, pagamento sicuro tramite Stripe e Paypal"
            />
          </div>

          </div>
        </div>
      </div>
    );
}

export default FooterBottom;    