import { motion } from "framer-motion";
import Scene3D from "./Scene3D";

export default function PageShell({ variant = "default", title, subtitle, badge, children, heroExtra }) {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] page-grid-bg">
      <Scene3D variant={variant} />
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-8 md:pt-12">
        {(title || subtitle) && (
          <motion.header
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="perspective-scene mb-12 md:mb-16"
          >
            {badge && (
              <span className="mb-4 inline-block rounded-full border border-jt-gold/40 bg-jt-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-jt-gold">
                {badge}
              </span>
            )}
            {title && <h1 className="font-display text-4xl font-bold leading-tight text-gradient-gold md:text-6xl lg:text-7xl">{title}</h1>}
            {subtitle && <p className="mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">{subtitle}</p>}
            {heroExtra}
          </motion.header>
        )}
        {children}
      </div>
    </div>
  );
}
