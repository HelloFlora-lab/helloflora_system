import type {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { CreateFloristDTO, CreateFloristSchema } from "../../../../modules/florist/types"
import { MedusaError } from "@medusajs/framework/utils"

import { createFloristWorkflow } from "../../../../workflows/florist/create-florist"



export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const { 
    data: florists, 
    metadata: { count, take, skip } = {
      count: 0,
      take: 20,
      skip: 0,
    },
  } = await query.graph({
    entity: "florist",
    ...req.queryConfig,
  })

  res.json({ 
    florists,
    count,
    limit: take,
    offset: skip,
  })
}


export async function POST(
  req: MedusaRequest<CreateFloristDTO>, 
  res: MedusaResponse
) {

   console.log("[DEBUG] AVVIO DELLA POST", req.body);
   
  const validatedBody = CreateFloristSchema.parse(req.body) as CreateFloristDTO;

  if (!validatedBody) {
    return MedusaError.Types.INVALID_DATA;
  }
  console.log("[DEBUG] AVVIO WORKFLOW", validatedBody);

  const { result: florist } = await createFloristWorkflow(req.scope).run({
    input: validatedBody,
  });

  return res.status(201).json({ florist });
}