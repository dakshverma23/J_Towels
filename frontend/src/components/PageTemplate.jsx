import { Link } from "react-router-dom";
import ParallaxImage from "./venetian/ParallaxImage";
import SplitHeading from "./venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";

export default function PageTemplate({ content }) {
  const { badge, title, subtitle, blocks, stats, contactInfo, heroImage } = content;
  const rootRef = useVenetianReveal();

  const titleLines = typeof title === "string" ? title.split(" ").reduce((acc, word, i, arr) => {
    if (i === 0) return [[word]];
    const last = acc[acc.length - 1];
    if (last.join(" ").length < 12) last.push(word);
    else acc.push([word]);
    return acc;
  }, []).map((g) => g.join(" ")) : title;

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container pb-16 md:pb-24">
        <p className="ven-reveal ven-eyebrow mb-6">{badge}</p>
        <div className="ven-reveal">
          <SplitHeading lines={Array.isArray(title) ? title : titleLines} className="ven-heading-xl max-w-4xl" />
        </div>
        {subtitle && <p className="ven-reveal ven-body mt-8">{subtitle}</p>}
      </section>

      {heroImage && (
        <div className="ven-container ven-reveal mb-20">
          <ParallaxImage src={heroImage} alt={badge} aspect="aspect-[21/9]" className="w-full" />
        </div>
      )}

      {stats && (
        <div className="ven-container ven-reveal mb-20 grid gap-px border border-ven-line bg-ven-line sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-ven-cream p-10 text-center">
              <p className="font-display text-4xl font-medium text-ven-ink md:text-5xl">{s.value}</p>
              <p className="mt-2 ven-eyebrow">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <section className="border-t border-ven-line py-20 md:py-28">
        <div className="ven-container grid gap-12 md:grid-cols-2">
          {blocks?.map((block, i) => (
            <article key={block.title} className="ven-reveal">
              <h3 className="font-display text-3xl font-medium text-ven-ink md:text-4xl">{block.title}</h3>
              <p className="mt-4 font-light leading-relaxed text-ven-muted">{block.body}</p>
              {i === 0 && (
                <Link to="/products" className="ven-link mt-8 inline-block text-sm">
                  View Products →
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      {contactInfo && (
        <section className="border-t border-ven-line bg-ven-sand py-20 md:py-28">
          <div className="ven-container grid gap-10 md:grid-cols-3">
            <div className="ven-reveal">
              <p className="ven-eyebrow mb-2">Email</p>
              <p className="text-lg text-ven-ink">{contactInfo.email}</p>
            </div>
            <div className="ven-reveal">
              <p className="ven-eyebrow mb-2">Phone</p>
              <p className="text-lg text-ven-ink">{contactInfo.phone}</p>
            </div>
            <div className="ven-reveal">
              <p className="ven-eyebrow mb-2">Address</p>
              <p className="text-lg text-ven-ink">{contactInfo.address}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
