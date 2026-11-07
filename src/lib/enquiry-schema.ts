import { z } from "zod";

import { enquiryServices } from "@/lib/business-config";

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(32)
    .regex(/^[+()\-\s\d]+$/, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  service: z.enum(enquiryServices),
  message: z.string().trim().min(10, "Please add a little more detail.").max(2000),
});