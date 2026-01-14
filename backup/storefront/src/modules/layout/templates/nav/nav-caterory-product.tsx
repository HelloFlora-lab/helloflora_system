import { Text, clx, useToggleState } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { listCategories } from "@lib/data/categories"


export default async function MenuBottom() {

  const productCategories = await listCategories()

  return (
    <nav className="">
      <ul className="flex justify-center lg:flex small:flex gap-x-6">
        
        {productCategories.map((category) => (
          <li key={category.id} className="py-2 lg:mx-5 text-base-semi uppercase text-theme-text-base hover:text-theme-accent">
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className=""
            >
              {category.name}
            </LocalizedClientLink>
          </li>
        ))}

      </ul>
    </nav>
  )
}
