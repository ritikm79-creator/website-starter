import { describe, expect, it } from "vitest";

import { enquirySchema } from "@/lib/enquiry-schema";

const validEnquiry = {
  fullName: "Aarav Sharma",
  phone: "+91 98765 43210",
  email: "aarav@example.com",
  service: "IPO Updates",
  message: "Please share your upcoming IPO information.",
};

describe("enquiry validation", () => {
  it("accepts a well-formed enquiry for a listed financial service", () => {
    expect(enquirySchema.safeParse(validEnquiry).success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a service outside the offered enquiry options", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, service: "Guaranteed Returns" }).success).toBe(false);
  });

  it("rejects a message shorter than ten characters", () => {
    expect(enquirySchema.safeParse({ ...validEnquiry, message: "Hello" }).success).toBe(false);
  });
});