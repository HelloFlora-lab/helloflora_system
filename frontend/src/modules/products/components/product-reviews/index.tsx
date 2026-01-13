"use client"
import { Button } from "@medusajs/ui"
import { useState, useEffect, useRef } from "react"
import ProductReviewsForm from "./form"
import { getProductReviews } from "@lib/data/products"
import { StoreProductReview } from "types/global"
import Star from "@modules/common/icons/star"
import StarSolid from "@modules/common/icons/star-solid"
import Review from "./review"
import CustomerReviewItem from "@modules/customer-review/customer-review-item"
import { formatDateToItalian } from "@lib/util/format-date"
import { ReateStars } from "@modules/common/components/rate-stars"
import ArrowDown from "@modules/common/icons/arrow-down"
import ArrowLeft from "@modules/common/icons/arrow-left"
import ArrowRight from "@modules/common/icons/arrow-right"

type ProductReviewsProps = {
  productId: string
}

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [page, setPage] = useState(1)
  const defaultLimit = 10
  const [reviews, setReviews] = useState<StoreProductReview[]>([])
  
  const [rating, setRating] = useState(0)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [count, setCount] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth)
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollButtons)
    window.addEventListener("resize", updateScrollButtons)
    return () => {
      el.removeEventListener("scroll", updateScrollButtons)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [reviews])

  useEffect(() => {
    getProductReviews({
      productId,
      limit: defaultLimit,
      offset: (page - 1) * defaultLimit,
    }).then(({ reviews: paginatedReviews, average_rating, count, limit }) => {
      setReviews((prev) => {
        const newReviews = paginatedReviews.filter(
          (review) => !prev.some((r) => r.id === review.id)
        )
        return [...prev, ...newReviews]
      })

      setRating(Math.round(average_rating))
      console.log(count, limit, page, count > limit * page)
      setHasMoreReviews(count > limit * page)
      setCount(count)

    })
  }, [page])

  return (
    <div className="bg-gray-2 py-8" id="review">
      <div className="flex flex-col items-center text-center mb-8">
        <h3 className="text-xl-regular text-theme-text-accent mb-2">
          Recensioni prodotto
        </h3>
        <p className="text-large-regular max-w-lg mb-2">
          Cosa dicono i nostri clienti su questo prodotto.
        </p>
        <div className="flex gap-x-2 justify-center items-center">
          <div className="flex gap-x-2">
           <ReateStars size={32} repeatCount={rating} maxRate={5} />
          </div>
          <span className="text-base-regular text-gray-600">
            {count} recensioni
          </span>
        </div>
      </div>

      <div className="relative">
        {/* Pulsante sinistra */}
        <button
          type="button"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 mx-2 bg-white rounded-full shadow p-2 border border-gray-300 hover:bg-gray-100 ${!canScrollLeft ? "opacity-50 cursor-not-allowed" : "hover:text-theme-accent"}`}
          aria-label="Scorri recensioni a sinistra"
        >
          <ArrowLeft size={20} />
        </button>
        {/* Pulsante destra */}
        <button
          type="button"
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 mx-2 bg-white rounded-full shadow p-2 border border-gray-300 hover:bg-gray-100 ${!canScrollRight ? "opacity-50 cursor-not-allowed" : "hover:text-theme-accent"}`}
          aria-label="Scorri recensioni a destra"
        >
          <ArrowRight size={20} />
        </button>
        {/* Container scrollabile */}
        <div
          ref={scrollRef}
          className="flex mx-4 gap-x-2 overflow-x-hidden px-5"
          style={{ scrollBehavior: "smooth" }}
        >
          {reviews.map((review) => {
            const formattedDate = formatDateToItalian(review.created_at)
            return (
              <CustomerReviewItem
                key={review.id}
                name={`${review.first_name} ${review.last_name.substring(0,1)}.`}
                date={formattedDate}
                rating={review.rating}
                title={review.title}
                details={review.content}
              />
            )
          })}
        </div>
      </div>

      {hasMoreReviews && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" onClick={() => setPage(page + 1)}>
            Carica più recensioni
          </Button>
        </div>
      )}

      <ProductReviewsForm productId={productId} />
    </div>
  )
}