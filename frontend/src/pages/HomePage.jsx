import { ArrowRight, BadgeCheck, Boxes, Factory, Gauge, Globe2, PackageCheck, Radar, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Scene3D from "../components/Scene3D";
import ParallaxImage from "../components/venetian/ParallaxImage";
import SplitHeading from "../components/venetian/SplitHeading";
import { useHeroEntrance, useVenetianReveal } from "../hooks/useVenetianReveal";
import api from "../services/api";

const proof = [
  { icon: Gauge, label: "Integrated flow", value: "Cotton to dispatch" },
  { icon: ShieldCheck, label: "Certified ops", value: "ISO aligned" },
  { icon: Globe2, label: "Buyer reach", value: "Global export" },
  { icon: PackageCheck, label: "Order mode", value: "Bulk and custom" }
];

const reviews = [
  {
    name: "Michael Torres",
    role: "Procurement Head, USA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    text: "Consistent quality across bulk duvet and kitchen linen orders with clear export documentation.",
    video: "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
  },
  {
    name: "Sarah Chen",
    role: "Hospitality Partner, Singapore",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    text: "Custom colors and quantities were handled cleanly, and the finish held up through repeated commercial laundering.",
    video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
  },
  {
    name: "Rajesh Mehta",
    role: "Domestic Client, India",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    text: "From sampling to full production, Jasmine Towels delivered exactly what we specified.",
    video: "https://videos.pexels.com/video-files/3209793/3209793-uhd_2560_1440_25fps.mp4"
  },
  {
    name: "Hans Weber",
    role: "Industrial Buyer, Germany",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    text: "Safety wear lines met our compliance requirements with transparent pricing before production.",
    video: "https://videos.pexels.com/video-files/4488161/4488161-uhd_2560_1440_25fps.mp4"
  }
];

const productionShowcase = [
  {
    label: "01 / Spinning",
    title: "Fiber-to-yarn control",
    img: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1000&q=80"
  },
  {
    label: "02 / Weaving",
    title: "Consistent towel structures",
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80"
  },
  {
    label: "03 / Finishing",
    title: "Color, softness, durability",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"
  },
  {
    label: "04 / Dispatch",
    title: "Packed for global movement",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"
  }
];

const qualityCards = [
  {
    icon: Factory,
    title: "Factory sync",
    text: "Madurai and Sivagangai stay in one production rhythm.",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80"
  },
  {
    icon: Boxes,
    title: "Dispatch logic",
    text: "Packing, documentation, and movement tracked before shipment.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"
  }
];

function TestimonialCard({ review: r }) {
  const videoRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = () => {
    setHovered(true);
    videoRef.current?.play();
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <blockquote
      className="testimonial-card group relative flex-shrink-0 w-[380px] md:w-[420px] overflow-hidden rounded-2xl border border-white/80 bg-white/70 shadow-[0_20px_60px_rgba(37,99,235,0.08)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_30px_80px_rgba(37,99,235,0.18)]"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Video overlay on hover */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}>
        <video
          ref={videoRef}
          src={r.video}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071833]/90 via-[#071833]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className={`relative z-20 flex flex-col justify-between p-8 min-h-[320px] transition-colors duration-500 ${hovered ? "text-white" : ""}`}>
        {/* Stars */}
        <div>
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, si) => (
              <svg key={si} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className={`font-display text-lg font-semibold leading-relaxed transition-colors duration-500 ${hovered ? "text-white" : "text-ven-ink"}`}>
            "{r.text}"
          </p>
        </div>

        {/* Author */}
        <footer className="mt-6 flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/40 ring-offset-1">
            <img src={r.avatar} alt={r.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className={`font-semibold text-sm transition-colors duration-500 ${hovered ? "text-white" : "text-ven-ink"}`}>{r.name}</p>
            <p className={`text-xs transition-colors duration-500 ${hovered ? "text-blue-200" : "text-ven-muted"}`}>{r.role}</p>
          </div>
        </footer>
      </div>
    </blockquote>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const rootRef = useVenetianReveal();
  const heroRef = useRef(null);
  useHeroEntrance(heroRef);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => setProducts(data.filter((product) => product.inStock !== false)))
      .finally(() => setProductsLoading(false));
  }, []);

  const marqueeProducts = products.length > 4 ? [...products, ...products] : products;

  return (
    <div ref={rootRef} className="home-stage">
      <section ref={heroRef} className="luxury-hero relative overflow-hidden pt-28 md:pt-32">
        <div className="hero-aurora" />
        <div className="hero-gridline" />
        <Scene3D variant="home" className="z-[2] left-1/2 -translate-x-1/2 top-[8vh] h-[60vh] w-[100vw] opacity-90 md:left-[14vw] md:translate-x-0 md:-top-10 md:h-[88vh] md:w-[72vw] md:opacity-100 xl:left-[17vw] xl:-top-16 xl:w-[66vw]" />
        <div className="ven-container relative z-10 grid min-h-[calc(100vh-8rem)] items-start gap-8 pb-12 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:pt-16">
          <div className="hero-copy relative z-10 pb-6">
            <div className="hero-fade mb-4 md:mb-6 inline-flex items-center gap-2 md:gap-3 rounded-full border border-white/70 bg-white/80 md:bg-white/70 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-[#1d4ed8] shadow-[0_18px_60px_rgba(37,99,235,0.12)] backdrop-blur-xl">
              <span className="grid h-5 w-5 md:h-6 md:w-6 place-items-center rounded-full bg-[#2563eb] text-white">
                <Sparkles size={11} />
              </span>
              Global textile export network
            </div>
            <h1 className="ven-heading-xl max-w-5xl text-white md:text-ven-ink">
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">CONNECTED</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">TEXTILES FOR</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line inline-block italic text-[#60a5fa] md:text-[#2563eb]">GLOBAL</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line inline-block">BUYERS</span>
              </span>
            </h1>
            <p className="hero-fade mt-5 md:mt-7 max-w-2xl text-sm md:text-lg leading-relaxed text-white/90 md:text-ven-muted">
              Jasmine Towels connects export-grade manufacturing in Tamil Nadu with buyers across
              the world, making bulk orders, custom colors, and reliable sourcing feel clear from the first touchpoint.
            </p>
            <div className="hero-fade mt-6 md:mt-9 flex flex-wrap gap-3">
              <Link to="/products" className="ven-btn">
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link to="/quality" className="ven-btn-outline">
                View Quality
              </Link>
            </div>
            <div className="hero-fade mt-6 md:mt-10 grid max-w-2xl gap-2 md:gap-3 grid-cols-3">
              {[
                ["07", "Export hubs"],
                ["2", "Factory floors"],
                ["24/7", "Order clarity"]
              ].map(([value, label]) => (
                <div key={label} className="hero-mini-stat">
                  <span>{value}</span>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-fade hero-visual relative z-10 mx-auto w-full max-w-[430px] justify-self-center lg:mr-0 xl:max-w-[470px]">
            <div className="absolute -left-12 top-10 z-20 hidden rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2563eb] shadow-[0_16px_50px_rgba(37,99,235,0.16)] backdrop-blur-xl md:inline-flex">
              <Radar size={14} className="mr-2" />
              Live routes
            </div>
            <div className="hero-image-shell group relative overflow-hidden p-2">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1500&q=80"
                alt="Premium textile manufacturing"
                aspect="aspect-[4/5]"
                className="w-full"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[12px] ring-1 ring-white/70 transition-all duration-500 group-hover:ring-[#60a5fa]/90" />
              <div className="hero-image-sheen" />
            </div>
            <div className="hero-float-card hero-float-a">
              <Waves size={18} />
              <span>Soft finish control</span>
            </div>
            <div className="hero-float-card hero-float-b">
              <BadgeCheck size={18} />
              <span>Export ready</span>
            </div>
            <div className="absolute -bottom-6 left-3 right-3 grid grid-cols-2 gap-2 md:left-6 md:right-6">
              <div className="hero-stat-card">
                <p>Export hubs</p>
                <strong>07</strong>
              </div>
              <div className="hero-stat-card is-dark">
                <p>Reach</p>
                <strong>Global</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ven-container relative z-10 -mt-6 pb-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proof.map(({ icon: Icon, label, value }) => (
            <div key={label} className="ven-reveal proof-card flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#2563eb]/12 text-[#2563eb]">
                <Icon size={20} />
              </span>
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-ven-muted">{label}</span>
                <span className="mt-1 block font-display text-xl font-semibold">{value}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="quality-panel relative overflow-hidden border-t border-ven-line py-20 md:py-28">
        <div className="ven-container relative z-10 grid items-stretch gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <div className="ven-reveal quality-video-card">
            <video
              className="quality-video"
              src="https://www.pexels.com/download/video/30183298/"
              poster="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=80"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
            <div className="quality-video-overlay" />
            <div className="quality-video-content">
              <p className="ven-eyebrow mb-5 !text-blue-100/80">Production intelligence</p>
              <SplitHeading lines={["QUALITY IS", "A LIVE SYSTEM."]} className="ven-heading-lg !text-white" />
              <p className="mt-6 max-w-md text-base leading-relaxed text-blue-50/76">
                A live view of process, precision, and accountability from fiber to packed shipment.
              </p>
            </div>
          </div>
          <div className="ven-reveal quality-console">
            <p className="ven-body">
              Every product moves through a controlled production path: spinning, weaving, wet processing,
              finishing, packing, and dispatch. The result is textile supply that feels calm, measurable, and ready for scale.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {qualityCards.map(({ icon: Icon, title, text, image }) => (
                <div key={title} className="quality-node">
                  <div className="quality-node-media">
                    <img src={image} alt={title} loading="lazy" />
                  </div>
                  <div className="quality-node-copy">
                    <Icon size={20} />
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="ven-btn-outline mt-9 inline-flex">
              Discover More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="product-theatre border-t border-[#1d4ed8]/20 py-14 md:py-20 text-white md:py-28">
        <div className="ven-container relative z-10">
          <div className="ven-reveal mb-4 flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
            <SplitHeading
              lines={["LIVE PRODUCT", "LINES IN MOTION"]}
              className="ven-heading-lg max-w-4xl !text-white"
            />
              <p className="mt-4 md:mt-6 max-w-xl text-xs md:text-sm font-semibold uppercase tracking-[0.14em] text-blue-100/60">
                Products are pulled directly from the database and managed by admin.
          </p>
            </div>
            <Link to="/products" className="ven-btn !border-white !bg-white !text-[#071833] hover:!bg-transparent hover:!text-white">
              View Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ven-reveal mt-12">
            {productsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-[360px] animate-pulse rounded-[8px] border border-white/10 bg-white/[0.06]" />
                ))}
              </div>
            ) : products.length ? (
              <div className={`product-marquee ${products.length > 4 ? "is-animated" : ""}`}>
                <div className={products.length > 4 ? "product-track" : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>
                  {marqueeProducts.map((product, index) => {
                    const media = product.media?.[0];
                    return (
                      <Link
                        key={`${product._id}-${index}`}
                        to="/products"
                        className="product-flow-card group"
                        aria-label={`View ${product.name}`}
                      >
                        <div className="relative h-[215px] overflow-hidden rounded-[8px] bg-[#0d2a55]">
                          {media?.mediaType === "video" ? (
                            <video src={media.url} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" muted loop playsInline autoPlay />
                          ) : media?.url ? (
                            <img src={media.url} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="grid h-full place-items-center bg-gradient-to-br from-[#1d4ed8] via-[#0f3b77] to-[#071833] p-6 text-center font-display text-3xl font-semibold text-white/80">
                              {product.name}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071833]/90 via-transparent to-transparent" />
                          <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                            {product.category}
                          </span>
                          <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-transform duration-300 group-hover:rotate-45">
                            <ArrowRight size={16} />
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200/60">
                            Min order {product.minOrderQty || 100}
                          </p>
                          <h3 className="mt-3 font-display text-3xl font-semibold leading-none text-white">{product.name}</h3>
                          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-blue-100/62">{product.description}</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {(product.badges?.length ? product.badges : ["Export ready"]).slice(0, 2).map((badge) => (
                              <span key={badge} className="rounded-full border border-blue-200/20 bg-blue-200/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-100">
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-[8px] border border-white/10 bg-white/[0.06] p-10 text-center">
                <Sparkles className="mx-auto text-blue-200" />
                <p className="mt-4 font-display text-3xl font-semibold">No product lines are live yet.</p>
                <p className="mx-auto mt-3 max-w-md text-sm text-blue-100/60">
                  Add products from the admin panel and they will appear here automatically from the product database.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="factory-showcase relative overflow-hidden border-t border-ven-line py-14 md:py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(14,165,233,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#38bdf8]/24 blur-3xl" />
        <div className="ven-container relative grid items-center gap-8 md:gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="ven-reveal">
            <p className="ven-eyebrow mb-4 md:mb-6 text-[#2563eb]">Production intelligence</p>
            <SplitHeading lines={["FROM FACTORY", "FLOOR TO GLOBAL", "DOCKS."]} className="ven-heading-lg max-w-3xl" />
            <p className="ven-body mt-5 md:mt-7">
              Every order moves through a visible chain of quality checkpoints: yarn preparation, weaving, wet processing,
              finishing, packing, and export dispatch. Buyers get clarity before production starts and confidence before goods ship.
            </p>
            <div className="mt-8 grid gap-3 grid-cols-3">
              {[
                ["2", "Factories"],
                ["4", "Core stages"],
                ["24/7", "Order visibility"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-[8px] border border-white/70 bg-white/70 p-3 md:p-4 shadow-[0_18px_50px_rgba(37,99,235,0.12)] backdrop-blur transition-transform duration-300 hover:-translate-y-1">
                  <p className="font-display text-xl md:text-3xl font-semibold text-[#0b2f6f]">{value}</p>
                  <p className="mt-1 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] text-ven-muted">{label}</p>
                </div>
              ))}
            </div>
            <Link to="/facilities" className="ven-btn mt-9 inline-flex">
              View Facilities <ArrowRight size={16} />
            </Link>
          </div>

          <div className="ven-reveal grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[210px] md:gap-4 lg:grid-cols-6">
            {productionShowcase.map((item, index) => (
              <Link
                key={item.label}
                to="/facilities"
                className={`showcase-card group relative overflow-hidden rounded-[8px] border border-white/70 bg-white/40 shadow-[0_24px_70px_rgba(37,99,235,0.16)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_34px_90px_rgba(37,99,235,0.24)] ${
                  index === 0 ? "col-span-2 row-span-2 lg:col-span-4" : "col-span-1 md:col-span-1 lg:col-span-2"
                }`}
              >
                <img src={item.img} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071833]/88 via-[#071833]/18 to-transparent" />
                <div className="absolute left-3 right-3 top-3 md:left-5 md:right-5 md:top-5 flex items-center justify-between">
                  <span className="rounded-full border border-white/30 bg-white/18 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
                    {item.label}
                  </span>
                  <span className="grid h-7 w-7 md:h-9 md:w-9 place-items-center rounded-full bg-white/18 text-white backdrop-blur transition-transform duration-300 group-hover:rotate-45">
                    <ArrowRight size={14} />
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5">
                  <p className="font-display text-lg md:text-2xl lg:text-3xl font-semibold leading-tight text-white">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial-cloud border-t border-ven-line py-14 md:py-20 lg:py-28 overflow-hidden">
        <div className="ven-container">
          <div className="ven-reveal text-center">
            <SplitHeading lines={["TRUSTED BY", "GLOBAL BUYERS"]} className="ven-heading-lg mx-auto" />
            <p className="mt-4 max-w-xl mx-auto text-base text-ven-muted">
              Real feedback from partners who scaled their textile sourcing with us.
            </p>
          </div>
        </div>

        {/* Horizontal marquee */}
        <div className="testimonial-marquee-wrapper mt-14">
          <div className="testimonial-marquee">
            <div className="testimonial-track">
              {[...reviews, ...reviews].map((r, i) => (
                <TestimonialCard key={`${r.name}-${i}`} review={r} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Social proof bar */}
        <div className="ven-container">
          <div className="ven-reveal mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8 rounded-2xl border border-white/70 bg-white/60 px-4 md:px-8 py-5 md:py-6 shadow-[0_12px_40px_rgba(37,99,235,0.06)] backdrop-blur-xl md:gap-12">
            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-[#0b2f6f]">150+</p>
              <p className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] text-ven-muted">Global buyers</p>
            </div>
            <div className="h-8 md:h-10 w-px bg-ven-line" />
            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-[#0b2f6f]">98%</p>
              <p className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] text-ven-muted">Reorder rate</p>
            </div>
            <div className="h-8 md:h-10 w-px bg-ven-line" />
            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-[#0b2f6f]">12+</p>
              <p className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.12em] text-ven-muted">Countries served</p>
            </div>
            <div className="h-10 w-px bg-ven-line hidden md:block" />
            <div className="text-center hidden md:block">
              <div className="flex -space-x-2 justify-center mb-1">
                {reviews.map((r, i) => (
                  <img key={i} src={r.avatar} alt="" className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ven-muted">Trusted partners</p>
            </div>
          </div>
        </div>
      </section>

      <section className="blue-glass-section border-t border-ven-line py-14 md:py-20 lg:py-28">
        <div className="ven-container relative grid gap-6 md:gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="ven-reveal">
            <SplitHeading lines={["READY TO", "BUILD AN ORDER?"]} className="ven-heading-lg" />
            <p className="ven-body mt-4 md:mt-6">
              Plan a bulk order, export partnership, or product customization with the same storefront and backend flow already in place.
            </p>
          </div>
          <div className="ven-reveal flex flex-wrap gap-3">
            <Link to="/products" className="ven-btn">
              Start Cart <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="ven-btn-outline">
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
