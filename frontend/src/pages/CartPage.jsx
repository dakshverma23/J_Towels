import { Button, Empty } from "antd";
import { Link } from "react-router-dom";
import SplitHeading from "../components/venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeItem } = useCart();
  const rootRef = useVenetianReveal([items.length]);

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container pb-16">
        <div className="ven-reveal">
          <SplitHeading lines={["YOUR", "ORDER"]} className="ven-heading-xl" />
        </div>
      </section>

      <section className="ven-container pb-24">
        {items.length === 0 ? (
          <div className="ven-reveal border border-ven-line bg-white py-20 text-center">
            <Empty description="Your order is empty" />
            <Link to="/products" className="ven-btn mt-8 inline-flex">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-ven-line border border-ven-line bg-white">
              {items.map((item, idx) => (
                <li key={`${item.product._id}-${idx}`} className="ven-reveal flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="ven-eyebrow">{item.product.category}</p>
                    <h3 className="font-display text-2xl font-medium text-ven-ink">{item.product.name}</h3>
                    <p className="mt-2 text-sm text-ven-muted">
                      Qty {item.quantity} · {item.color}
                    </p>
                  </div>
                  <Button onClick={() => removeItem(idx)} className="!rounded-none !border-ven-ink !bg-transparent !text-ven-ink">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <div className="ven-reveal mt-10 flex flex-wrap gap-4">
              <Link to="/checkout" className="ven-btn">
                Proceed to Checkout
              </Link>
              <Link to="/products" className="ven-btn-outline">
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
