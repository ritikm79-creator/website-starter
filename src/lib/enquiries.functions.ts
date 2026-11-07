import { createServerFn } from "@tanstack/react-start";

import { enquirySchema } from "@/lib/enquiry-schema";

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