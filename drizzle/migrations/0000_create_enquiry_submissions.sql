CREATE TABLE public.enquiry_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name varchar(120) NOT NULL,
  phone varchar(32) NOT NULL,
  email varchar(254) NOT NULL,
  service varchar(64) NOT NULL CHECK (service IN ('IPO Updates', 'Unlisted Shares', 'Forex Trading & Mentorship', 'Portfolio Management', 'General Enquiry')),
  message varchar(2000) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiry_submissions TO service_role;
GRANT ALL ON public.enquiry_submissions TO service_role;
ALTER TABLE public.enquiry_submissions ENABLE ROW LEVEL SECURITY;