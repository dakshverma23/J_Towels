import { Button, Form, Input, InputNumber, Modal, Select, Table, Tag, Upload, message, Popconfirm, Space, Image } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/products");
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      minOrderQty: product.minOrderQty,
      colors: product.colors?.join(", "),
      sizes: product.sizes?.join(", "),
      badges: product.badges?.join(", "),
      inStock: product.inStock,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      slug: values.name.toLowerCase().replaceAll(" ", "-"),
      colors: values.colors?.split(",").map((x) => x.trim()).filter(Boolean) || [],
      sizes: values.sizes?.split(",").map((x) => x.trim()).filter(Boolean) || [],
      badges: values.badges?.split(",").map((x) => x.trim()).filter(Boolean) || [],
    };

    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, payload);
      message.success("Product updated");
    } else {
      await api.post("/products", payload);
      message.success("Product created");
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    message.success("Product deleted");
    load();
  };

  const handleUpload = async (file, productId) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const product = products.find((p) => p._id === productId);
    await api.put(`/products/${productId}`, { media: [...(product.media || []), data] });
    message.success("Media uploaded");
    load();
    return false;
  };

  const columns = [
    {
      title: "Media",
      width: 80,
      render: (_, r) => r.media?.[0] ? (
        <Image src={r.media[0].url} width={50} height={50} className="object-cover rounded" />
      ) : (
        <div className="w-[50px] h-[50px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
          No img
        </div>
      ),
    },
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Category", dataIndex: "category", filters: [...new Set(products.map(p => p.category))].map(c => ({ text: c, value: c })), onFilter: (v, r) => r.category === v },
    { title: "Price", dataIndex: "price", render: (v) => `$${v}`, sorter: (a, b) => a.price - b.price },
    { title: "Min Qty", dataIndex: "minOrderQty" },
    { title: "Stock", render: (_, r) => <Tag color={r.inStock ? "green" : "red"}>{r.inStock ? "In Stock" : "Out"}</Tag> },
    { title: "Badges", render: (_, r) => r.badges?.map((b) => <Tag key={b} className="mb-1">{b}</Tag>) },
    {
      title: "Actions",
      width: 200,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Edit</Button>
          <Upload beforeUpload={(file) => handleUpload(file, r._id)} showUploadList={false}>
            <Button icon={<UploadOutlined />} size="small">Media</Button>
          </Upload>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(r._id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          rowKey="_id"
          dataSource={products}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 900 }}
        />
      </div>

      <Modal
        title={editingProduct ? "Edit Product" : "New Product"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Bath Towels Premium" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Input placeholder="e.g. Bath" />
            </Form.Item>
            <Form.Item name="price" label="Price ($)" rules={[{ required: true }]}>
              <InputNumber className="!w-full" min={0} step={0.1} />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Product description..." />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="minOrderQty" label="Min Order Qty">
              <InputNumber className="!w-full" min={1} />
            </Form.Item>
            <Form.Item name="inStock" label="In Stock" initialValue={true}>
              <Select options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]} />
            </Form.Item>
          </div>
          <Form.Item name="colors" label="Colors" rules={[{ required: true }]}>
            <Input placeholder="White, Ivory, Grey (comma separated)" />
          </Form.Item>
          <Form.Item name="sizes" label="Sizes">
            <Input placeholder="Twin, Queen, King (comma separated)" />
          </Form.Item>
          <Form.Item name="badges" label="Badges">
            <Input placeholder="ISO Certified, Best Seller (comma separated)" />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
