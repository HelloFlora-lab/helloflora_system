import Star from "@modules/common/icons/star"
import StarSolid from "@modules/common/icons/star-solid"
import { StoreProductReview } from "types/global"


export default function ProductReview({ review }: { review: StoreProductReview }) {
  return (
    <div className="flex flex-col gap-y-2 text-base-regular text-base-theme-text-accent">
      <div className="flex gap-x-2 items-center">
        {review.title && <strong>{review.title}</strong>}
        <div className="flex gap-x-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index}>
              {index <= review.rating ? (
                <StarSolid size={16}  />
              ) : (
                <Star size={16}  />
              )}
            </span>
          ))}
        </div>
      </div>
      <div>{review.content}</div>
      <div className="border-t border-ui-border-base pt-4 text-sm-regular">
        {review.first_name} {review.last_name}
      </div>
    </div>
  )
}
