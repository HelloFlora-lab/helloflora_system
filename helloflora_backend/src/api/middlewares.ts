import { authenticate, defineMiddlewares, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";


import { PostStoreReviewSchema } from "./store/reviews/validation-schemas";
import { GetStoreReviewsSchema } from "./store/reviews/route";
import { GetAdminReviewsSchema } from "./admin/reviews/route";
import { PostAdminUpdateReviewsStatusSchema } from "./admin/reviews/status/validation-schemas";

import { adminFloristSchema } from "./admin/florists/florist-validation-schemas"
import { PostNearbyFloristsSchema } from "./store/florist-check/validation-schemas";
import { PostStoreNewsletterSchema } from "./store/newsletter-signup/validation-schemas";


export default defineMiddlewares({
  routes: [


     // --- PRODUCTS REVIEWS ----
   {
      matcher: "/admin/reviews",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetAdminReviewsSchema, {
          isList: true,
          defaults: [
            "id",
            "title",
            "content",
            "rating",
            "product_id",
            "customer_id",
            "status",
            "created_at",
            "updated_at",
            "product.*",
          ],
        }),
      ],
    },
     {
      matcher: "/admin/reviews/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminUpdateReviewsStatusSchema),
      ],
    },
    {
      method: ["POST"], 
      matcher: "/store/reviews",
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        validateAndTransformBody(PostStoreReviewSchema),
      ],
    },

    {
      method: ["GET"], 
      matcher: "/store/reviews",
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
           "id", 
            "rating", 
            "title", 
            "first_name", 
            "last_name", 
            "content", 
            "created_at",
          ],
        }),
      ],
    },

    {
      matcher: "/store/products/:id/reviews",
      methods: ["GET"],
      middlewares: [
        validateAndTransformQuery(GetStoreReviewsSchema, {
          isList: true,
          defaults: [
            "id", 
            "rating", 
            "title", 
            "first_name", 
            "last_name", 
            "content", 
            "created_at",
          ],
        }),
      ],
    },



     // --- FLORISTS ----
    {
      matcher: "/admin/florists",
      method: ["GET"],
      middlewares: [
        validateAndTransformQuery(adminFloristSchema, {
          //isList: true,
          defaults: [
            "id",
            "name",
            "company_name",
            "address",
            "city",
            "county",
            "country",
            "zip_code",
            "main_phone",
            "second_phone",
            "email",
            "note",
            "close_time",
            "is_open",
            "image_url",
            "iban",
            "rate",
            "florist_status",
            "created_at",
            "updated_at",
          ],
        }),
      ],
    },
    /*
    {
      matcher: "/admin/florists/status",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostFloristsStatusSchema),
      ],
    },

     {
      matcher: "/admin/florists/:id",
      method: ["POST"],
      middlewares: [
        validateAndTransformBody(UpdateFloristSchema),
      ],
    },
*/


    {
      method: ["POST"], 
      matcher: "/store/florist-check",
      middlewares: [
        validateAndTransformBody(PostNearbyFloristsSchema),
      ],
    },

   
    {
      method: ["POST"], 
      matcher: "/store/newsletter-subscriptions",
      middlewares: [
        validateAndTransformBody(PostStoreNewsletterSchema),
      ],
    },


    
    

  ]
})