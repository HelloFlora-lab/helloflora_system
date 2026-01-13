"use client"

import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "@modules/layout/components/country-select"
import SocialLinks from "@modules/layout/templates/social-links"

import { HttpTypes } from "@medusajs/types"


const MenuTop = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
   <div className="flex w-full justify-between color-white text-white bg-theme-main">
        <div className="content-container my-1 flex " >

          <div className="flex w-14 flex-row items-center">
            <SocialLinks />
          </div>

          <div className="flex-auto ">

          </div>
          
          <div className="flex-none gap-y-6">
            <div
              className="flex justify-between"
              onMouseEnter={toggleState.open}
              onMouseLeave={toggleState.close}
              >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                            position='bottom'
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      
          </div>

        </div>
         
    </div>
  )
}

export default MenuTop
