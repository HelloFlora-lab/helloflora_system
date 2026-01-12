import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import Navbar from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"


export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <Navbar />
    <div className="content-container pt-4">
      <LocalizedClientLink
          href="/cart"
          className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
          data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
              Torna al carrello
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Indietro
            </span>
        </LocalizedClientLink>
    </div>
    <div className="relative" data-testid="checkout-container">
      
      {children}
    
    </div>
    <Footer />
    
    </>






  )
}
