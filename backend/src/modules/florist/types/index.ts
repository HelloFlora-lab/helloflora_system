import { z } from "zod";

export enum FloristStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface FloristDTO {
  id: string;
  name: string;
  
  company_name?: string;
  
  address: string;
  city: string;
  county: string;
  country: string;
  zip_code: string;

  location?: {
    lat: number;
    lng: number;
  };
  
  main_phone: string;
  second_phone?: string;
  email?: string;
  website?: string;
  
  note?: string;

  close_time?: string,
  is_open?: boolean;

  image_url?: string;
  iban?: string,
  rate: number,
  
  florist_status: FloristStatus;

  created_at: Date;
  updated_at: Date;

  //products?: ProductDTO[];
}

export const CreateFloristSchema = z.object({

    name: z.string().min(1, "Name is required"),
    company_name:z.string().optional(),

    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    county: z.string().min(1, "County is required"),
    country: z.string().min(1, "Country is required"),
    zip_code: z.string().min(1, "Zip code is required"),

    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),

    main_phone: z.string().min(1, "Main phone is required"),
    second_phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    website: z.string().optional(),

    note: z.string().optional(),
    close_time: z.string().optional(),
    is_open: z.boolean().optional(),

    image_url: z.string().optional(),
    iban: z.string().optional(),

    florist_status: z.nativeEnum(FloristStatus).optional().default(FloristStatus.PENDING),

});