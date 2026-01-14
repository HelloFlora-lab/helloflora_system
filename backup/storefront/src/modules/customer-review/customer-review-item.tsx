import Star from "@modules/common/icons/star";
import CustomerReviewStar from "./customer-review-star";
import Like from "@modules/common/icons/like";
import User from "@modules/common/icons/user";
import { ReateStars } from "../common/components/rate-stars";

type ReviewItemProps = {
  name: string;
  date: string;
  rating: number;
  like?: number;
  title: string;
  details: string;
};

const CustomerReviewItem = ({
  name,
  date,
  rating,
  like,
  title,
  details,
}: ReviewItemProps) => {
  return (
    <div className="w-full px-4 "> 

      <div className="overflow-hidden rounded-lg border border-stroke bg-white">

        <div className="items-center justify-between border-b border-stroke px-4 pt-3 flex md:px-4">
          
          <div className="mb-3">
            <ReateStars repeatCount={rating} maxRate={5} />
          </div>

          <p className="mb-3 text-theme-text-base text-base-regular">
            {" "}
            {date}{" "}
          </p>
          
        </div>

        <div className="px-6 py-2 sm:py-4 md:px-4">
          <h4 className="mb-2 text-large-semi text-theme-text-accent sm:text-xl">
            {title}
          </h4>
          <p className="text-base text-theme-text-base">
            {details}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between border-t border-stroke px-4 pt-2 md:px-4">
          <div className="mb-3 flex items-center">
            <h3 className="flex items-center gap-2 text-base text-theme-text-base">
              <span>{name}</span>
            </h3>
          </div>

          <div className="mb-[18px] flex items-center space-x-5">
            <button className="flex items-center text-theme-text-base hover:text-theme-accent">
              <span className="mr-2">
                {like !== undefined && <Like width={20} height={20} />}
              </span>
              <span className="text-base font-medium text-theme-text-base"> {like} </span>
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerReviewItem;