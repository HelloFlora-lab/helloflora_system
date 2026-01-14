import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"


import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SocialLinks from "@modules/layout/templates/social-links"
import NavLink from "./nav-link";
import LinkGroup from "./link-group";
import FooterBottom from "./footer-bottom";
import FooterBlogPosts from "./footer-blog-posts";


export default async function Footer() {



  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
  <>
  <footer className="relative z-10 bg-theme-main">
     
      <div className="container mx-auto pt-14 lg:pt-20">

        <div className="flex flex-wrap">

          <div className="w-full sm:w-6/12 md:w-6/12 lg:w-3/12 xl:w-3/12">

            <div className="mb-10 w-full sm:text-left text-center px-4 sm:mx-0">
              <LocalizedClientLink 
              href="/" className="mb-6 inline-block max-w-[160px]"
              title="HelloFlora - Consegna fiori online in tutta Italia">
              <div 
                className="w-[200] h-[68] bg-no-repeat bg-contain" 
                style={{
                  backgroundImage: 'var(--theme-logo-footer-url)',
                  //color: 'hsl(var(--color-text))' 
                }} aria-label="HelloFlora" />

              </LocalizedClientLink>
              <p className="mb-7 text-base text-theme-text-base">
                Consegna fiori online rapida e affidabile in tutta Italia. Scopri i bouquet su misura e le eleganti composizioni di fiori freschi di HelloFlora. Ordina ora per occasioni speciali o sorprese dell’ultimo minuto: qualità garantita e confezione curata per un servizio eccellente.
              </p>
              <div className=" flex items-center justify-center md:justify-start">
                <SocialLinks />
              </div>
            </div>

          </div>

           <div className="w-full sm:w-6/12 md:w-6/12 lg:w-3/12 xl:w-3/12">

            <FooterBlogPosts />
            
          </div>

          <div className="w-full text-center md:text-left px-2 md:w-12/12 lg:w-6/12 xl:w-6/12 lg:pl-20 flex flex-wrap gap-y-10 sm:gap-y-0 justify-center sm:justify-start whitespace-nowrap">
            <div className="grid grid-cols-3 gap-4 w-full">
              {productCategories && productCategories?.length > 0 && (
                <LinkGroup header="Prodotti">
              
                  <div className="flex flex-col gap-y-2">
                    
                      {productCategories?.slice(0, 6).map((c) => {
                        if (c.parent_category) {
                          return
                        }

                        const children =
                          c.category_children?.map((child) => ({
                            name: child.name,
                            handle: child.handle,
                            id: child.id,
                          })) || null

                        return (
                          <NavLink link={`/categories/${c.handle}`} label={c.name} key={c.id} />
                        )
                      })}
                    
                  </div>
                </LinkGroup>
                )}
            
            <LinkGroup header="HelloFlora">
              <NavLink link="/company/aboutus" label="Chi siamo" title="Chi siamo - HelloFlora"  />
              <NavLink link="/blog" label="I nostri consigli" title="Guide, Tutorial e Consigli Pratici  - HelloFlora" />
              <NavLink link="/faq" label="FAQ" title="FAQ Domande e risposte - HelloFlora" />
               <NavLink link="/review" label="Recensioni" title="Recensioni Verificate - HelloFlora" />
              <NavLink link="/information/quality" label="Qualità" title="La Nostra Qualità - HelloFlora" />
              <NavLink link="/information/sustainability" label="Sostenibilità" title="Sostenibilità HelloFlora: La Nostra Missione Green" />
            </LinkGroup>

            <LinkGroup header="Aiuto">
            <NavLink link="/flora-AI" label="Flora AI" title="Utilizza la nostra assistente AI per scegliere i fiori perfetti" />
              <NavLink link="/account" label="Account" title="Gestisci il tuo Account - HelloFlora" />
              <NavLink link="/help/support" label="Supporto" title="Supporto - HelloFlora" />
              <NavLink link="/contact" label="Contatti" />
            </LinkGroup>
          </div>
        </div>
      </div>
    </div>
      <FooterBottom />

    </footer>

{/* 
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
          <div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
           
          </div>
        </div>
       
      </div>
    </footer>
*/}
    </>
    
  )
}
