import { Link } from "react-router-dom";
import { useRef } from "react";
import ParallaxImage from "../components/venetian/ParallaxImage";
import SplitHeading from "../components/venetian/SplitHeading";
import { useHeroEntrance, useVenetianReveal } from "../hooks/useVenetianReveal";

const services = [
  { title: ["BATH", "TEXTILES"], sub: "Blankets & thermal towels", img: "https://images.unsplash.com/photo-1616627457505-60e9b4ecc7a3?auto=format&fit=crop&w=900&q=80", to: "/products" },
  { title: ["KITCHEN", "LINEN"], sub: "Pot holders & kitchen range", img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80", to: "/products" },
  { title: ["SALON", "TOWELS"], sub: "Professional salon lines", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80", to: "/products" },
  { title: ["EXPORT", "SERIES"], sub: "P · R · Y collections", img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80", to: "/products" }
];

const reviews = [
  { name: "Global Buyer — USA", text: "Consistent quality across bulk duvet and kitchen linen orders. On-time export documentation and reliable communication." },
  { name: "Hospitality Partner", text: "Custom colors and quantities handled professionally. The wet processing finish has held up beautifully through repeated commercial laundering." },
  { name: "Domestic Client", text: "From sampling to full production, Jasmine Towels delivered exactly what we specified. We will continue our partnership." },
  { name: "Industrial Buyer", text: "Safety wear line met our compliance requirements. Transparent pricing confirmed before production began." }
];

export default function HomePage() {
  const rootRef = useVenetianReveal();
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  return (
    <div ref={rootRef}>
      {/* Hero — Venetian split headline */}
      <section ref={heroRef} className="relative flex min-h-screen flex-col justify-end pb-16 pt-28 md:pb-24">
        <div className="ven-container">
          <p className="hero-fade ven-eyebrow mb-6">India&apos;s Premier Textile Manufacturer</p>
          <h1 className="ven-heading-xl">
            <span className="block overflow-hidden">
              <span className="hero-line inline-block">A REFINED WEAVE,</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line inline-block">THE JASMINE</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line inline-block italic">WAY</span>
            </span>
          </h1>
          <div className="hero-fade mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="ven-btn">
              Explore Products
            </Link>
          </div>
        </div>
        <div className="ven-container mt-16 md:mt-24">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
            alt="Textile manufacturing"
            aspect="aspect-[21/9] md:aspect-[3/1]"
            className="w-full"
          />
        </div>
      </section>

      {/* Beauty is a way of life → Quality is a way of life */}
      <section className="border-t border-ven-line py-24 md:py-32">
        <div className="ven-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="ven-reveal">
            <SplitHeading lines={["QUALITY IS", "A WAY OF LIFE."]} className="ven-heading-lg" />
          </div>
          <div className="ven-reveal">
            <p className="ven-body">
              It is found in every thread, in each considered process, and in the unhurried pace of craftsmanship done right. Jasmine Towels brings this sensibility to global markets — offering export-grade textiles where every detail is thoughtfully prepared.
            </p>
            <Link to="/about" className="ven-btn-outline mt-10 inline-flex">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Sensory experience → Manufacturing */}
      <section className="border-t border-ven-line bg-ven-sand py-24 md:py-32">
        <div className="ven-container">
          <div className="ven-reveal mb-4">
            <SplitHeading lines={["A TEXTILE EXPERIENCE,", "THOUGHTFULLY", "COMPOSED"]} className="ven-heading-lg max-w-3xl" />
          </div>
          <p className="ven-reveal ven-eyebrow mt-6">From cotton to finished export goods.</p>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.title.join("")} to={s.to} className="group ven-reveal ven-service-tile">
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <img src={s.img} alt="" className="h-full w-full object-cover opacity-40" />
                </div>
                <div className="relative z-10">
                  <h3>
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </h3>
                  <p>{s.sub}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="ven-reveal mt-12 text-center">
            <Link to="/products" className="ven-link text-sm">
              Explore Our Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Every detail */}
      <section className="border-t border-ven-line py-24 md:py-32">
        <div className="ven-container grid items-center gap-12 lg:grid-cols-2">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80"
            alt="Weaving facility"
            className="ven-reveal w-full"
          />
          <div className="ven-reveal">
            <SplitHeading lines={["EVERY DETAIL,", "A PLEASURE."]} className="ven-heading-lg" />
            <p className="ven-body mt-8">
              Step into our facilities and experience thoughtful production at every stage. Each space is designed for precision — spinning, weaving, wet processing, and manufacturing united under one vision.
            </p>
            <Link to="/facilities" className="ven-link mt-8 inline-block text-sm">
              View Facilities →
            </Link>
          </div>
        </div>
      </section>

      {/* Escape CTA */}
      <section className="border-t border-ven-line bg-ven-ink py-24 text-ven-cream md:py-32">
        <div className="ven-container text-center">
          <div className="ven-reveal">
            <SplitHeading
              lines={["EXPERIENCE", "YOUR JASMINE", "ESCAPE"]}
              className="ven-heading-lg !text-ven-cream mx-auto max-w-4xl"
            />
          </div>
          <p className="ven-reveal mx-auto mt-8 max-w-lg font-light text-ven-sand">
            A calm, thoughtfully designed operation where care, detail, and refinement come together for every bulk and custom order.
          </p>
          <Link to="/contact" className="ven-reveal ven-btn mt-12 !border-ven-cream !bg-ven-cream !text-ven-ink hover:!bg-transparent hover:!text-ven-cream">
            Visit Us Today
          </Link>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-ven-line py-24 md:py-32">
        <div className="ven-container">
          <div className="ven-reveal text-center">
            <SplitHeading lines={["TRUSTED BY", "GLOBAL BUYERS"]} className="ven-heading-lg mx-auto" />
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {reviews.map((r) => (
              <blockquote key={r.name} className="ven-reveal border border-ven-line bg-white p-8 md:p-10">
                <p className="font-display text-xl font-medium italic leading-relaxed text-ven-ink md:text-2xl">
                  &ldquo;{r.text}&rdquo;
                </p>
                <footer className="mt-6 ven-eyebrow !normal-case !tracking-wide">{r.name}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Contact teaser */}
      <section className="border-t border-ven-line bg-ven-sand py-24 md:py-32">
        <div className="ven-container grid gap-12 lg:grid-cols-2">
          <div className="ven-reveal">
            <SplitHeading lines={["GET IN TOUCH", "WITH US"]} className="ven-heading-lg" />
            <p className="ven-body mt-6">
              Whether you&apos;re planning a bulk order, export partnership, or product customization — we&apos;re here to make it effortless.
            </p>
          </div>
          <div className="ven-reveal flex items-end">
            <Link to="/contact" className="ven-btn">
              Send Message
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
