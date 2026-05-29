import { Link } from "react-router-dom";

export default function NeonButton({ to, onClick, children, variant = "primary", type = "button" }) {
  const base =
    variant === "primary"
      ? "bg-gradient-to-r from-jt-gold to-amber-300 text-jt-ink shadow-glow"
      : "border border-white/20 bg-white/5 text-jt-cream hover:border-jt-gold/50 hover:bg-white/10";

  const className = `btn-3d rounded-2xl px-6 py-3 font-semibold ${base}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      <span>{children}</span>
    </button>
  );
}
