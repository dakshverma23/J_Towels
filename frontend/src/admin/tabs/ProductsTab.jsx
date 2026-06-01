import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Form, Image, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Tag, Upload, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalMedia, setModalMedia] = useState([]);
  const [modalUploading, setModalUploading] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const [prodRes, catRes] = await Promise.all([api.get("/products"), api.get("/categories")]);
    setProducts(prodRes.data);
    setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const categoryOptions = categories.map((c) => ({ value: c.name, label: c.name }));

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setModalMedia([]);
    form.resetFields();
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalMedia([]);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalMedia(product.media || []);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      minOrderQty: product.minOrderQty,
      colors: product.colors?.join(", "),
      sizes: product.sizes?.join(", "),
      badges: product.badges?.join(", "),
      inStock: product.inStock
    });
    setModalOpen(true);
  };

  const uploadMedia = async (file) => {
    setModalUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setModalMedia((prev) => [...prev, data]);
      message.success(`${data.mediaType === "video" ? "Video" : "Image"} uploaded`);
    } catch {
      message.error("Media upload failed");
    } finally {
      setModalUploading(false);
    }
    return false;
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      colors: values.colors?.split(",").map((x) => x.trim()).filter(Boolean) || [],
      sizes: values.sizes?.split(",").map((x) => x.trim()).filter(Boolean) || [],
      badges: values.badges?.split(",").map((x) => x.trim()).filter(Boolean) || [],
      media: modalMedia
    };

    if (editingProduct) {
      await api.put(`/products/${editingProduct._id}`, payload);
      message.success("Product updated");
    } else {
      await api.post("/products", payload);
      message.success("Product created");
    }
    closeModal();
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    message.success("Product deleted");
    load();
  };

  const quickUpload = async (file, productId) => {
    setModalUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const product = products.find((p) => p._id === productId);
      await api.put(`/products/${productId}`, { media: [...(product.media || []), data] });
      message.success("Media uploaded");
      load();
    } catch {
      message.error("Media upload failed");
    } finally {
      setModalUploading(false);
    }
    return false;
  };

  const columns = [
    {
      title: "Media",
      width: 92,
      render: (_, r) =>
        r.media?.[0] ? (
          r.media[0].mediaType === "video" ? (
            <video src={r.media[0].url} className="h-[54px] w-[54px] rounded object-cover" muted playsInline />
          ) : (
            <Image src={r.media[0].url} width={54} height={54} className="object-cover rounded" />
          )
        ) : (
          <div className="flex h-[54px] w-[54px] items-center justify-center rounded bg-blue-50 text-xs text-blue-300">No img</div>
        )
    },
    { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: "Category",
      dataIndex: "category",
      filters: [...new Set(products.map((p) => p.category))].map((c) => ({ text: c, value: c })),
      onFilter: (v, r) => r.category === v
    },
    { title: "Price", dataIndex: "price", render: (v) => `$${v}`, sorter: (a, b) => a.price - b.price },
    { title: "Min Qty", dataIndex: "minOrderQty" },
    { title: "Media Count", render: (_, r) => <Tag color="blue">{r.media?.length || 0}</Tag> },
    { title: "Stock", render: (_, r) => <Tag color={r.inStock ? "green" : "red"}>{r.inStock ? "In Stock" : "Out"}</Tag> },
    { title: "Badges", render: (_, r) => r.badges?.map((b) => <Tag key={b} className="mb-1">{b}</Tag>) },
    {
      title: "Actions",
      width: 235,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(r)}>Edit</Button>
          <Upload beforeUpload={(file) => quickUpload(file, r._id)} showUploadList={false} multiple accept="image/*,video/*">
            <Button icon={<UploadOutlined />} size="small" loading={modalUploading}>Media</Button>
          </Upload>
          <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(r._id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Product
        </Button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <Table
          rowKey="_id"
          dataSource={products}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1050 }}
        />
      </div>

      <Modal title={editingProduct ? "Edit Product" : "New Product"} open={modalOpen} onCancel={closeModal} footer={null} width={760}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Bath Towels Premium" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select
                placeholder="Select a category"
                options={categoryOptions}
                showSearch
                filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
              />
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

          <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/70 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Product Images & Videos</label>
                <p className="text-xs text-gray-500">Upload multiple Cloudinary assets before creating or updating the product.</p>
              </div>
              <Upload beforeUpload={uploadMedia} showUploadList={false} multiple accept="image/*,video/*">
                <Button icon={<UploadOutlined />} loading={modalUploading}>Upload Media</Button>
              </Upload>
            </div>

            {modalMedia.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {modalMedia.map((m, i) => (
                  <div key={`${m.publicId || m.url}-${i}`} className="overflow-hidden rounded-lg border border-white bg-white shadow-sm">
                    {m.mediaType === "video" ? (
                      <video src={m.url} className="h-28 w-full object-cover" muted playsInline controls />
                    ) : (
                      <Image src={m.url} width="100%" height={112} className="!h-28 object-cover" />
                    )}
                    <div className="flex items-center justify-between px-2 py-1">
                      <Tag color={m.mediaType === "video" ? "blue" : "cyan"}>{m.mediaType || "image"}</Tag>
                      <button type="button" onClick={() => setModalMedia((prev) => prev.filter((_, idx) => idx !== i))} className="text-xs font-semibold text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded border border-dashed border-blue-200 bg-white/70 p-6 text-center text-sm text-gray-500">
                No media uploaded yet.
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" disabled={modalUploading}>
              {editingProduct ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
