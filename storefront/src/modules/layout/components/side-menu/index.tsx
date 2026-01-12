"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import Menu from "@modules/common/icons/menu"

const SideMenuItems = [
  { name: "Home", url: "/", title: "Vai alla Home" },
  { name: "Flora AI", url: "/flora-AI", title: "Scopri Flora AI" },
  { name: "Store", url: "/store", title: "Scopri lo Store" },
  { name: "Account", url: "/account", title: "Gestisci il tuo Account" },
  { name: "Cart", url: "/cart", title: "Visualizza il Carrello" },
  { name: "Consigli", url: "/blog", title: "Leggi i Consigli" },
  { name: "FAQ", url: "/faq", title: "Domande frequenti" },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full ">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  <Menu size={26} className="hover:text-theme-accent" />
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm m-2 backdrop-blur-xl bg-theme-accent/20">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-theme-accent/20 rounded-rounded justify-between p-6"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-6 items-start justify-start">
                      {SideMenuItems.map((item) => (
                        <li key={item.name}>
                          <LocalizedClientLink
                            href={item.url}
                            className="text-3xl leading-10 text-theme-text-accent hover:text-white"
                            onClick={close}
                            data-testid={`${item.name.toLowerCase()}-link`}
                            title={item.title}
                          >
                            {item.name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      <div
                        className="flex justify-between"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                            position='top'
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small">
                        
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
