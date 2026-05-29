export default function ParallaxImage({ src, alt, className = "", aspect = "aspect-[4/5]" }) {
  return (
    <div className={`ven-parallax-img ven-img-wrap ${aspect} ${className}`}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
