'use client'

import { useEffect, useState } from "react"
import { Button, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import CustomerReviewItem from "./customer-review-item";
import { StoreReview } from "types/global"
import { getReviews } from "@lib/data/reviews"
import Review from "@modules/checkout/components/NEW/review";
import { formatDateToItalian } from "@lib/util/format-date";

const CustomerReview = () => {

  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState<StoreReview[]>([])
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  
  const [count, setCount] = useState(0)

  const defaultLimit = 8

  useEffect(() => {

      getReviews({
        limit: defaultLimit,
        offset: (page - 1) * defaultLimit,
      }).then(({ reviews: paginatedReviews, count, limit }) => {
        setReviews((prev) => {
          const newReviews = paginatedReviews.filter(
            (review) => !prev.some((r) => r.id === review.id)
          )
          return [...prev, ...newReviews]
        })
       
        console.log(count, limit, page, count > limit * page)
        setHasMoreReviews(count > limit * page)
        setCount(count)
      })
    }, [page])
  
  




  return (
    <section className="bg-gray-2 pb-10 pt-6 lg:py-10 rounded-lg">
      <div className="container mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4 w-full">

          {reviews.map((review) => {
            const formattedDate = formatDateToItalian(review.created_at)

            return (
                <div key={review.id} style={{  }}>
              <CustomerReviewItem
                key={review.id}
                name={`${review.first_name} ${review.last_name.substring(0,1)}.`}
                date={formattedDate}
                rating={review.rating}
                title={review.title}
                details={review.content}
                /*like={35}*/
              />
                </div>
            )
          })}

          </div>
          <div>
            {hasMoreReviews && (
                <div className="flex justify-center mt-8">
                  <Button variant="primary" onClick={() => setPage(page + 1)} className="w-60 items-center shadow-none justify-center rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white">
                    Altre Recensioni
                  </Button>
                </div>
              )}

          </div>
      </div>
    </section>
  )
}
export default CustomerReview;
