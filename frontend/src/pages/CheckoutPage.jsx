import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import SplitHeading from "../components/venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const navigate = useNavigate();
  const rootRef = useVenetianReveal();

  const submit = async (values) => {
    if (!items.length) {
      message.warning("Add products first");
      return;
    }
    try {
      await api.post("/orders", {
        items: items.map((item) => ({
          product: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          color: item.color
        })),
        shippingAddress: values
      });
      clear();
      message.success("Order placed successfully");
      navigate("/");
    } catch {
      message.error("Please login to place an order");
      navigate("/auth");
    }
  };

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container pb-12">
        <div className="ven-reveal">
          <SplitHeading lines={["SHIPPING", "DETAILS"]} className="ven-heading-xl" />
        </div>
        <p className="ven-reveal ven-body mt-6">Complete your address to place the order.</p>
      </section>

      <section className="ven-container max-w-3xl pb-24">
        <Form layout="vertical" onFinish={submit} className="ven-reveal grid gap-2 border border-ven-line bg-white p-8 md:grid-cols-2 md:gap-x-6 md:p-12">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]} className="md:col-span-2">
            <Input size="large" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="line1" label="Address Line 1" rules={[{ required: true }]} className="md:col-span-2">
            <Input size="large" />
          </Form.Item>
          <Form.Item name="line2" label="Address Line 2" className="md:col-span-2">
            <Input size="large" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="postalCode" label="Postal Code" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <Form.Item name="country" label="Country" rules={[{ required: true }]}>
            <Input size="large" />
          </Form.Item>
          <div className="md:col-span-2">
            <Button htmlType="submit" className="ven-btn !mt-4 w-full md:w-auto">
              Place Order
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
}
