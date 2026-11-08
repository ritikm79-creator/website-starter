import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FinancialGlobe } from "@/components/financial-globe";
import { businessConfig, enquiryServices, services } from "@/lib/business-config";
import { enquirySchema } from "@/lib/enquiry-schema";
import { submitEnquiry } from "@/lib/enquiries.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Financial Services & Investment Insights | Financial Services" },
      {
        name: "description",
        content:
          "Explore IPO updates, unlisted shares, forex education, and portfolio-related services with transparent financial information.",
      },
      { property: "og:title", content: "Financial Services & Investment Insights" },
      {
        property: "og:description",
        content: "Financial information and guidance across four investment-related service areas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinancialServicesHome,
});

const navigation = [
  ["About", "about"],
  ["Services", "services"],
  ["Our approach", "approach"],
  ["How it works", "process"],
  ["Contact", "contact"],
] as const;

const values = [
  ["01", "Professional guidance", "Relevant information, considered carefully."],
  ["02", "Market insights", "A closer look at developments that matter."],
  ["03", "Transparent communication", "Clarity around services, process, and risk."],
  ["04", "A client-first approach", "Understanding your needs before the discussion."],
  ["05", "Connected perspectives", "Information across multiple financial segments."],
] as const;

const stages = [
  ["01", "Explore", "Review the services and understand what each offers."],
  ["02", "Select", "Choose the financial service you are interested in."],
  ["03", "Connect", "Send an enquiry or reach out through WhatsApp."],
  ["04", "Discuss", "Talk through your requirements and next questions."],
] as const;

type EnquiryErrors = Partial<Record<"fullName" | "phone" | "email" | "message", string>>;

function whatsappUrl(message: string) {
  const number = businessConfig.whatsappNumber.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : "";
}

function FinancialServicesHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<(typeof enquiryServices)[number]>("General Enquiry");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formResult, setFormResult] = useState<{ success: boolean; message: string } | null>(null);
  const submitEnquiryFn = useServerFn(submitEnquiry);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const parsed = enquirySchema.safeParse({ fullName: name, phone, email, service, message });
    if (!parsed.success) {
      const nextErrors: EnquiryErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (
          (key === "fullName" || key === "phone" || key === "email" || key === "message") &&
          !nextErrors[key]
        ) {
          nextErrors[key] = issue.message;
        }
      });
      setErrors(nextErrors);
      setFormResult(null);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setFormResult(null);
    try {
      const result = await submitEnquiryFn({ data: parsed.data });
      setFormResult(result);
      if (result.success) {
        setName("");
        setPhone("");
        setEmail("");
        setService("General Enquiry");
        setMessage("");
      }
    } catch {
      setFormResult({ success: false, message: "Your enquiry could not be saved. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Financial Services home">
          <span className="wordmark-symbol" aria-hidden="true">F</span>
          <span className="wordmark-copy"><strong>{businessConfig.name || "FINANCIAL"}</strong><small>SERVICES &amp; INSIGHTS</small></span>
        </a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
        </nav>
        <Button asChild className="header-cta"><a href="#contact">Start a conversation <ArrowUpRight /></a></Button>
        <Button
          variant="ghost"
          size="icon"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >{menuOpen ? <X /> : <Menu />}</Button>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-atmosphere" aria-hidden="true" />
        <FinancialGlobe />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> FINANCIAL SERVICES &amp; INSIGHTS</div>
          <h1>Your gateway to<br /><em>smarter financial</em><br />opportunities.</h1>
          <p className="hero-intro">Explore IPO opportunities, unlisted shares, forex trading mentorship, and portfolio management services with professional financial insights and guidance.</p>
          <div className="hero-actions">
            <Button asChild size="lg"><a href="#services">Explore our services <ArrowDown /></a></Button>
            <WhatsAppLink message="Hello, I would like to learn more about your financial services." label="Connect on WhatsApp" variant="outline" />
          </div>
          <div className="hero-footnote"><ShieldCheck aria-hidden="true" /> INFORMATION FIRST. DECISIONS MADE WITH CARE.</div>
        </div>
        <div className="hero-side-note" aria-hidden="true"><span>INFORMED PERSPECTIVES</span><i /></div>
        <a className="scroll-indicator" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown aria-hidden="true" /></a>
        <div className="hero-index" aria-hidden="true">01 / 04</div>
      </section>

      <section className="intro-section section-shell" id="about">
        <div className="section-marker"><span>01</span><i /> ABOUT</div>
        <div className="intro-content">
          <p className="eyebrow eyebrow-light">A MORE INFORMED FINANCIAL JOURNEY</p>
          <h2>Empowering your<br /><em>financial journey.</em></h2>
          <p className="intro-description">{businessConfig.about}</p>
          <div className="intro-signature"><span className="signature-mark">F</span><span>{businessConfig.name || "FINANCIAL SERVICES"}<small>INFORMATION. INSIGHT. CONVERSATION.</small></span></div>
        </div>
        <div className="intro-ornament" aria-hidden="true"><div className="intro-ring intro-ring-one"/><div className="intro-ring intro-ring-two"/><div className="intro-ring intro-ring-three"/><span>F</span></div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading-row">
          <div><div className="section-marker"><span>02</span><i /> OUR SERVICES</div><h2>Explore what<br /><em>moves you forward.</em></h2></div>
          <p className="section-aside">Four areas of financial information and guidance.<br />One conversation at a time.</p>
        </div>
        <div className="services-list">
          {services.map((item) => (
            <article className="service-row" key={item.number}>
              <div className="service-index"><span>{item.number}</span><i /></div>
              <div className="service-main">
                <p className="service-kicker">{item.shortName}</p>
                <h3>{item.title}</h3>
                <p className="service-description">{item.description}</p>
                {"note" in item && <p className="service-note"><ShieldCheck aria-hidden="true" /> {item.note}</p>}
                <div className="service-features">{item.features.map((feature) => <span key={feature}><Check aria-hidden="true" />{feature}</span>)}</div>
              </div>
              <div className="service-art" aria-hidden="true"><ServiceOrbit index={Number(item.number)} /></div>
              <div className="service-action"><WhatsAppLink message={item.message} label={`Enquire about ${item.shortName}`} variant="ghost" iconOnly /></div>
            </article>
          ))}
        </div>
        <div className="service-disclaimer"><ShieldCheck aria-hidden="true" /><span>Financial markets involve risk. Information here is general and educational, not a promise of returns or personalized investment advice.</span></div>
      </section>

      <section className="approach-section section-shell" id="approach">
        <div className="approach-heading"><div className="section-marker"><span>03</span><i /> OUR APPROACH</div><h2>Why connect<br /><em>with us?</em></h2><p>Clear information. Thoughtful conversations. A more considered way to explore financial services.</p></div>
        <div className="values-list">{values.map(([number, title, text]) => <article className="value-row" key={number}><span className="value-index">{number}</span><h3>{title}</h3><p>{text}</p><span className="value-node" aria-hidden="true" /></article>)}</div>
        <div className="approach-orbit" aria-hidden="true"><div/><div/><div/><span>F</span></div>
      </section>

      <section className="process-section section-shell" id="process">
        <div className="section-marker"><span>04</span><i /> THE PROCESS</div>
        <div className="process-heading"><h2>From curiosity<br /><em>to conversation.</em></h2><p>A simple way to begin exploring the services that interest you.</p></div>
        <div className="process-track">{stages.map(([number, title, text], index) => <article className="process-step" key={number}><div className="process-node"><span>{number}</span>{index < stages.length - 1 && <i />}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="contact-section section-shell" id="contact">
        <div className="contact-copy"><div className="section-marker"><span>05</span><i /> GET IN TOUCH</div><p className="eyebrow eyebrow-light">THE NEXT STEP IS A CONVERSATION</p><h2>Let’s start a<br /><em>conversation.</em></h2><p className="contact-description">Have questions about IPOs, unlisted shares, forex mentorship, or portfolio-related services? Tell us what you’re exploring.</p>
          <WhatsAppLink message="Hello, I have a question about your financial services." label="Connect with us on WhatsApp" variant="outline" />
          <div className="contact-meta">{businessConfig.name && <span>{businessConfig.name}</span>}{businessConfig.location && <span>{businessConfig.location}</span>}{businessConfig.email && <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>}{!businessConfig.name && !businessConfig.location && !businessConfig.email && <span className="config-note">Business contact details will appear here when configured.</span>}</div>
        </div>
        <form className="enquiry-form" onSubmit={submit} noValidate>
          <div className="form-heading"><span>ENQUIRY FORM</span><span>01 — 05</span></div>
          <div className="form-field"><label htmlFor="fullName">Full name</label><input id="fullName" name="fullName" autoComplete="name" placeholder="Your name" maxLength={120} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} />{errors.fullName && <span id="fullName-error" className="field-error">{errors.fullName}</span>}</div>
          <div className="form-two-col">
            <div className="form-field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" maxLength={32} value={phone} onChange={(event) => setPhone(event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />{errors.phone && <span id="phone-error" className="field-error">{errors.phone}</span>}</div>
            <div className="form-field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</div>
          </div>
          <div className="form-field"><label htmlFor="service">Service of interest</label><div className="select-wrap"><select id="service" name="service" value={service} onChange={(event) => setService(event.target.value as (typeof enquiryServices)[number])}>{enquiryServices.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown aria-hidden="true" /></div></div>
          <div className="form-field"><label htmlFor="message">Message / enquiry</label><textarea id="message" name="message" placeholder="Tell us what you would like to know..." maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</div>
          <div className="form-submit-row"><Button type="submit" disabled={submitting} size="lg">{submitting ? "Sending…" : "Send enquiry"}{submitting ? null : <ArrowRight />}</Button><span>YOUR DETAILS ARE HANDLED WITH CARE.</span></div>
          <p className="form-status" role="status" aria-live="polite">{formResult && <><CircleCheck aria-hidden="true" className={formResult.success ? "status-success" : "status-error"} />{formResult.message}</>}</p>
        </form>
      </section>

      <section className="closing-section">
        <div className="closing-orbit" aria-hidden="true"><div/><div/><div/><span>F</span></div>
        <div className="closing-content"><p className="eyebrow">A THOUGHTFUL PLACE TO BEGIN</p><h2>Your next financial<br /><em>conversation starts here.</em></h2><p>Explore financial insights. Discover available services. Connect with our team.</p><div className="closing-actions"><Button asChild size="lg"><a href="#services">Explore our services <ArrowDown /></a></Button><WhatsAppLink message="Hello, I would like to connect with your team." label="Connect with us" variant="outline" /></div></div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="wordmark footer-wordmark" href="#home"><span className="wordmark-symbol" aria-hidden="true">F</span><span className="wordmark-copy"><strong>{businessConfig.name || "FINANCIAL"}</strong><small>SERVICES &amp; INSIGHTS</small></span></a><p>{businessConfig.description}</p><a className="back-to-top" href="#home">BACK TO TOP <ArrowUpRight aria-hidden="true" /></a></div>
        <div className="footer-links"><div><span className="footer-label">EXPLORE</span><a href="#about">About</a><a href="#services">Services</a><a href="#approach">Our approach</a><a href="#contact">Contact</a></div><div><span className="footer-label">SERVICES</span>{services.map((item) => <a key={item.number} href="#services">{item.shortName}</a>)}</div><div><span className="footer-label">CONTACT</span>{businessConfig.whatsappNumber ? <a href={whatsappUrl("Hello, I would like to connect.")}>WhatsApp <ArrowUpRight /></a> : <span>WhatsApp setup pending</span>}{businessConfig.email && <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>}{businessConfig.location && <span>{businessConfig.location}</span>}{!businessConfig.email && !businessConfig.location && <span>Business details pending</span>}</div></div>
        <div className="risk-disclosure"><ShieldCheck aria-hidden="true" /><p>Investments and financial market activities involve risks, including the possible loss of capital. Information presented on this website is for general informational and educational purposes and should not be interpreted as a guarantee of returns or personalized investment advice. Visitors should independently assess risks and consult appropriately qualified and authorized professionals before making financial decisions.</p></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {businessConfig.name || "FINANCIAL SERVICES"}</span><details className="legal-details"><summary>Privacy, terms &amp; risk <ChevronDown aria-hidden="true" /></summary><p>Enquiry details are stored securely to respond to your request. Information on this website is for general informational purposes only. Services are subject to applicable authorizations, and financial decisions involve risk. Please request the business’s complete privacy policy and terms before submitting sensitive information.</p></details><span>INFORMATION. INSIGHT. CONVERSATION.</span></div>
      </footer>

      {businessConfig.whatsappNumber && <a className="floating-whatsapp" href={whatsappUrl("Hello, I would like to connect with your team.")} target="_blank" rel="noreferrer" aria-label="Connect on WhatsApp"><span>WA</span></a>}
    </main>
  );
}

function WhatsAppLink({ message, label, variant, iconOnly = false }: { message: string; label: string; variant: "outline" | "ghost"; iconOnly?: boolean }) {
  const url = whatsappUrl(message);
  if (!url) return <Button type="button" variant={variant} disabled title="WhatsApp contact details are not configured yet">{iconOnly ? <span className="pending-label">WhatsApp setup pending</span> : <>{label}<ArrowUpRight /></>}</Button>;
  return <Button asChild variant={variant} aria-label={label}>{iconOnly ? <a href={url} target="_blank" rel="noreferrer" title={label}><ArrowUpRight /></a> : <a href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight /></a>}</Button>;
}

function ServiceOrbit({ index }: { index: number }) {
  return <><span className={`service-orbit orbit-${index}`} /><span className={`orbit-dot dot-${index}`} /><span className={`orbit-core core-${index}`} /></>;
}
