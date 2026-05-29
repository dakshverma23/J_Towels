import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag, message } from "antd";
import { useEffect, useState } from "react";
import SplitHeading from "../components/venetian/SplitHeading";
import { useVenetianReveal } from "../hooks/useVenetianReveal";
import api from "../services/api";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const rootRef = useVenetianReveal([products.length, orders.length]);

  const load = async () => {
    const [p, o] = await Promise.all([api.get("/products"), api.get("/orders")]);
    setProducts(p.data);
    setOrders(o.data);
  };

  useEffect(() => {
    load();
  }, []);

  const uploadFile = async (file, productId) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const product = products.find((p) => p._id === productId);
    await api.put(`/products/${productId}`, { ...product, media: [...(product.media || []), data] });
    load();
  };

  const removeProduct = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const onCreate = async (values) => {
    await api.post("/products", {
      ...values,
      slug: values.name.toLowerCase().replaceAll(" ", "-"),
      colors: values.colors.split(",").map((x) => x.trim()),
      badges: values.badges?.split(",").map((x) => x.trim()) || []
    });
    message.success("Product created");
    setOpen(false);
    load();
  };

  return (
    <div ref={rootRef} className="pt-24 md:pt-28">
      <section className="ven-container flex flex-wrap items-end justify-between gap-6 border-b border-ven-line pb-12">
        <div className="ven-reveal">
          <SplitHeading lines={["ADMIN", "PANEL"]} className="ven-heading-lg" />
        </div>
        <Button onClick={() => setOpen(true)} className="ven-reveal !h-auto !rounded-none !border-ven-ink !bg-ven-ink !px-8 !py-3.5 !font-sans !text-xs !uppercase !tracking-[0.35em] !text-ven-cream hover:!bg-transparent hover:!text-ven-ink">
          Add Product
        </Button>
      </section>

      <section className="ven-container py-12">
        <h3 className="ven-reveal ven-eyebrow mb-6">Products</h3>
        <div className="ven-reveal overflow-x-auto border border-ven-line bg-white">
          <Table
            rowKey="_id"
            dataSource={products}
            pagination={{ pageSize: 8 }}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Category", dataIndex: "category" },
              { title: "Price", render: (_, r) => `$${r.price}` },
              { title: "Badges", render: (_, r) => r.badges?.map((b) => <Tag key={b}>{b}</Tag>) },
              {
                title: "Media",
                render: (_, r) => (
                  <Input type="file" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], r._id)} />
                )
              },
              { title: "", render: (_, r) => <Button danger size="small" onClick={() => removeProduct(r._id)}>Delete</Button> }
            ]}
          />
        </div>
      </section>

      <section className="ven-container pb-24">
        <h3 className="ven-reveal ven-eyebrow mb-6">Orders</h3>
        <div className="ven-reveal overflow-x-auto border border-ven-line bg-white">
          <Table
            rowKey="_id"
            dataSource={orders}
            pagination={{ pageSize: 8 }}
            columns={[
              { title: "Customer", render: (_, r) => r.user?.name || "—" },
              { title: "Items", render: (_, r) => r.items.map((i) => `${i.productName} (${i.quantity})`).join(", ") },
              {
                title: "Status",
                render: (_, r) => (
                  <Select
                    value={r.status}
                    onChange={(v) => api.patch(`/orders/${r._id}/status`, { status: v }).then(load)}
                    style={{ width: 140 }}
                    options={["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => ({
                      value: s,
                      label: s
                    }))}
                  />
                )
              }
            ]}
          />
        </div>
      </section>

      <Modal title="New Product" open={open} onCancel={() => setOpen(false)} footer={null}>
        <Form layout="vertical" onFinish={onCreate}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="minOrderQty" label="Min Qty">
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="colors" label="Colors" rules={[{ required: true }]}>
            <Input placeholder="White, Ivory" />
          </Form.Item>
          <Form.Item name="badges" label="Badges">
            <Input placeholder="ISO Certified" />
          </Form.Item>
          <button type="submit" className="ven-btn">
            Create
          </button>
        </Form>
      </Modal>
    </div>
  );
}
