import { Button, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SplitHeading from "../components/venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [choices, setChoices] = useState({});
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const rootRef = useVenetianReveal([products.length]);

  useEffect(() => {
    api
      .get("/products")
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const updateChoice = (id, patch) => {
    setChoices((prev) => ({ ...prev, [id]: { quantity: 100, ...prev[id], ...patch } }));
  };

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container border-b border-ven-line pb-16 md:pb-20">
        <p className="ven-reveal ven-eyebrow mb-6">Catalog</p>
        <div className="ven-reveal">
          <SplitHeading lines={["OUR", "PRODUCTS"]} className="ven-heading-xl" />
        </div>
        <p className="ven-reveal ven-body mt-8">Select quantities, colors, and build your export order.</p>
      </section>

      <section className="ven-container py-16 md:py-24">
        {loading ? (
          <p className="ven-eyebrow animate-pulse">Loading collection…</p>
        ) : (
          <div className="grid gap-px border border-ven-line bg-ven-line md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const choice = choices[product._id] || {
                quantity: product.minOrderQty || 100,
                color: product.colors?.[0] || "White"
              };
              return (
                <article key={product._id} className="ven-reveal flex flex-col bg-ven-cream">
                  <div className="aspect-[4/3] overflow-hidden bg-ven-sand">
                    {product.media?.[0] ? (
                      <img src={product.media[0].url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center font-display text-2xl text-ven-muted">{product.name}</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <p className="ven-eyebrow">{product.category}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium text-ven-ink">{product.name}</h3>
                    <p className="mt-3 flex-1 text-sm font-light text-ven-muted">{product.description}</p>
                    <p className="mt-4 font-display text-xl text-ven-accent">${product.price?.toFixed(2)} / unit</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div>
                        <label className="ven-eyebrow mb-2 block">Qty</label>
                        <InputNumber
                          min={product.minOrderQty || 1}
                          value={choice.quantity}
                          onChange={(v) => updateChoice(product._id, { quantity: v })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="ven-eyebrow mb-2 block">Color</label>
                        <Select
                          value={choice.color}
                          onChange={(v) => updateChoice(product._id, { color: v })}
                          className="w-full"
                          options={(product.colors || ["White"]).map((c) => ({ value: c, label: c }))}
                        />
                      </div>
                    </div>
                    <Button
                      className="mt-6 !h-12 !rounded-none !border-ven-ink !bg-ven-ink !font-sans !text-xs !uppercase !tracking-widest hover:!bg-transparent hover:!text-ven-ink"
                      onClick={() => {
                        addToCart(product, choice.quantity, choice.color);
                        message.success("Added to order");
                      }}
                    >
                      Add to Order
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className="ven-reveal mt-12 text-center">
          <Link to="/cart" className="ven-btn">
            View Order Cart
          </Link>
        </div>
      </section>
    </div>
  );
}
