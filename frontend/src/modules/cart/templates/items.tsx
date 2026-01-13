import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="pb-3 flex items-center">
        <h1 className="text-large-semi font-sans">
          Carrello
        </h1>
      </div>
      <Table className="">
        
        <Table.Header className="border-0 ">
          <Table.Row className="border-0 ">
            <Table.HeaderCell className="">Prodotto</Table.HeaderCell>
            <Table.HeaderCell className=""></Table.HeaderCell>
            <Table.HeaderCell className="">Quantità</Table.HeaderCell>
            <Table.HeaderCell className=" hidden small:table-cell">
              Prezzo
            </Table.HeaderCell>
            <Table.HeaderCell className="text-right">
              Totale
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
