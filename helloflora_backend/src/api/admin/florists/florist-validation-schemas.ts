import { z } from "zod";
import { FloristStatus } from "../../../modules/florist/types";


export const adminFloristSchema = z.object({
  name: z.string(),
  company_name: z.string().optional(),

  address: z.string(),
  city: z.string(),
  county: z.string(),
  country: z.string(),
  zip_code: z.string(),

  main_phone: z.string(),
  second_phone: z.string().optional(),
  email: z.string().email().or(z.literal('')),

  location: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
    
  website: z.string().url().optional(),

  note: z.string().optional(),

  close_time: z.string().optional(),
  is_open: z.boolean().optional(),

  image_url: z.string().optional(),

  iban: z.string().optional(),

  rate: z.number(),
  
  florist_status: z.nativeEnum(FloristStatus).optional(),
})