import { Suspense } from "react"
import Image from 'next/image'

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

import User from "@modules/common/icons/user"
import Basket from "@modules/common/icons/basket"

import ThemeSwitcher from "../../../common/components/theme/theme-switcher"
import MenuTop from "./nav-top"
import NavCategoryProduct from "./nav-caterory-product"
import NavMenu from "./nav-menu"


export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <MenuTop regions={regions}/>
      <header className="relative h-16 mx-auto  duration-200 bg-white ">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="lg:hidden h-full">
              <SideMenu regions={regions} />
            </div>
            <div className="hidden lg:block lg:flex h-full">
              <NavMenu  />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              <div 
                className="w-40 h-10 bg-no-repeat bg-contain" 
                style={{
                  backgroundImage: 'var(--theme-logo-main-url)',
                }} aria-label="HelloFlora" />
                
            </LocalizedClientLink>
          </div>

          <div className="flex items-center  h-full flex-1 basis-0 justify-end">
            <div className="hidden lg:block lg:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <User width={26} height={26} className="text-theme-secondary hover:text-theme-secondary-light" />
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <span className="relative mr-5 flex items-center justify-center">
                        <Basket width={26} height={26} className="text-theme-secondary hover:text-theme-secondary-light" />
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-theme-main text-[10px] font-semibold text-primary">
                            1
                        </span>
                    </span>
                    
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>
      <div className="item-center justify-center w-full hidden lg:flex bg-white border-b border-ui-border-base">
        <NavCategoryProduct />
      </div>
      
    </div>
  )
}
