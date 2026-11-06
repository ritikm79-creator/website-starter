import { createServerFn } from "@tanstack/react-start";
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

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiry_submissions").insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      service: data.service,
      message: data.message,
    });

    if (error) {
      console.error("Enquiry submission could not be saved.");
      return { success: false as const, message: "Your enquiry could not be saved. Please try again." };
    }

    return { success: true as const, message: "Your enquiry has been received." };
  });