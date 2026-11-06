export const businessConfig = {
  name: "",
  location: "",
  email: "",
  whatsappNumber: "",
  socialLinks: [],
  description:
    "Financial information and guidance across IPOs, unlisted shares, forex education, and portfolio-related services.",
  about:
    "We are a financial services business focused on providing market insights, investment-related information, and financial guidance across multiple financial segments. Our objective is to make relevant financial information more accessible while maintaining a commitment to transparent communication, professional assistance, and informed decision-making. Through our services, we aim to help individuals explore financial opportunities and better understand the markets.",
} as const;

export const services = [
  {
    number: "01",
    shortName: "IPO updates",
    title: "A clearer view of every offering.",
    description:
      "Stay informed about upcoming IPOs, subscription updates, important dates, company information, and listing-related developments.",
    features: [
      "Opening and closing dates",
      "Subscription updates",
      "Company fundamentals",
      "Listing developments",
    ],
    message: "Hello, I would like to know more about your IPO-related services and updates.",
  },
  {
    number: "02",
    shortName: "Unlisted shares",
    title: "Look beyond the exchange.",
    description:
      "Explore information about unlisted companies, company fundamentals, relevant market developments, and available investment-related opportunities.",
    features: [
      "Company information",
      "Business fundamentals",
      "Market developments",
      "Enquiry-based assistance",
    ],
    message:
      "Hello, I am interested in learning more about unlisted shares and the information you provide.",
  },
  {
    number: "03",
    shortName: "Forex education",
    title: "Understand currency markets.",
    description:
      "Explore forex market concepts, currency-market insights, technical analysis, and risk-management principles through structured mentorship.",
    features: [
      "Market education",
      "Trading concepts",
      "Technical analysis",
      "Risk management",
    ],
    message:
      "Hello, I would like to know more about your forex trading mentorship and educational services.",
  },
  {
    number: "04",
    shortName: "Portfolio services",
    title: "A more considered approach.",
    description:
      "Explore portfolio-related services covering investment objectives, asset allocation, risk considerations, and portfolio monitoring, subject to applicable regulatory authorization.",
    features: [
      "Investment objectives",
      "Asset allocation information",
      "Risk considerations",
      "Portfolio monitoring",
    ],
    message:
      "Hello, I would like to know more about your portfolio management services.",
    note: "Subject to applicable regulatory authorization.",
  },
] as const;

export const enquiryServices = [
  "IPO Updates",
  "Unlisted Shares",
  "Forex Trading & Mentorship",
  "Portfolio Management",
  "General Enquiry",
] as const;