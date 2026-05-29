import { Badge, Drawer } from "antd";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [
  ["About", "/about"],
  ["Products", "/products"],
  ["Facilities", "/facilities"],
  ["Quality", "/quality"],
  ["Careers", "/careers"],
  ["Contact", "/contact"]
];

export default function AppLayout({ children }) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-ven-cream">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-ven-line bg-ven-cream/95 py-3 backdrop-blur-md" : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="ven-container flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-medium tracking-tight text-ven-ink md:text-2xl">
            Jasmine Towels
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => `ven-link ${isActive ? "opacity-100" : "opacity-70"}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Badge count={totalItems} offset={[-2, 2]}>
              <Link to="/cart" className="ven-link flex items-center gap-2 !tracking-normal">
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Order</span>
              </Link>
            </Badge>
            <Link to="/products" className="ven-btn hidden sm:inline-flex">
              Place Order
            </Link>
            <button className="lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Menu">
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        placement="right"
        width={320}
        closeIcon={<X size={20} />}
        styles={{ body: { background: "#f7f4ef", padding: 32 }, header: { background: "#f7f4ef" } }}
        title={<span className="font-display text-2xl">Menu</span>}
      >
        <nav className="flex flex-col gap-6">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={() => setMenuOpen(false)} className="ven-link text-sm">
              {label}
            </NavLink>
          ))}
          <Link to="/products" onClick={() => setMenuOpen(false)} className="ven-btn mt-4 w-full text-center">
            Place Order
          </Link>
          {user?.role === "admin" && (
            <button onClick={() => { setMenuOpen(false); navigate("/admin"); }} className="ven-link text-left">
              Admin
            </button>
          )}
          <button
            onClick={() => {
              setMenuOpen(false);
              user ? logout() : navigate("/auth");
            }}
            className="ven-link text-left"
          >
            {user ? "Logout" : "Login"}
          </button>
        </nav>
      </Drawer>

      <main>{children}</main>

      <footer className="border-t border-ven-line bg-ven-sand">
        <div className="ven-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-3xl font-medium text-ven-ink">Jasmine Towels Pvt. Ltd.</p>
            <p className="mt-4 max-w-md font-light text-ven-muted">
              Manufacturer and exporter of premium textile products. ISO 9001 · 14001 · 45001 certified.
            </p>
          </div>
          <div>
            <p className="ven-eyebrow mb-4">Navigate</p>
            <div className="flex flex-col gap-3">
              {links.map(([label, path]) => (
                <Link key={path} to={path} className="ven-link !normal-case !tracking-normal text-sm text-ven-muted hover:text-ven-ink">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="ven-eyebrow mb-4">Facilities</p>
            <p className="text-sm font-light text-ven-muted">Madurai · Sivagangai</p>
            <p className="mt-6 ven-eyebrow">© {new Date().getFullYear()} Jasmine Towels</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
