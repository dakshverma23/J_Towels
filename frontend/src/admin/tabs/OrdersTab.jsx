import { Table, Tag, Select, Card, Input, Space, Badge, Descriptions, Modal } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../services/api";

const statusColors = {
  pending: "orange",
  confirmed: "blue",
  processing: "cyan",
  shipped: "purple",
  delivered: "green",
  cancelled: "red",
};

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => ({
  value: s,
  label: s.charAt(0).toUpperCase() + s.slice(1),
}));

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/orders");
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    load();
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search || 
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.includes(search);
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns = [
    {
      title: "Order ID",
      render: (_, r) => <span className="font-mono text-xs">{r._id.slice(-8)}</span>,
    },
    {
      title: "Customer",
      render: (_, r) => (
        <div>
          <div className="font-medium">{r.user?.name || "—"}</div>
          <div className="text-xs text-gray-500">{r.user?.email || ""}</div>
        </div>
      ),
    },
    {
      title: "Items",
      render: (_, r) => (
        <div>
          {r.items.map((item, i) => (
            <div key={i} className="text-sm">
              {item.productName} × {item.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, r) => (
        <Select
          value={r.status}
          onChange={(v) => updateStatus(r._id, v)}
          options={statusOptions}
          style={{ width: 140 }}
          size="small"
        />
      ),
    },
    {
      title: "Date",
      render: (_, r) => new Date(r.createdAt).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Details",
      render: (_, r) => (
        <Button icon={<EyeOutlined />} size="small" onClick={() => setDetailOrder(r)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <Space>
          <Input
            placeholder="Search by name, email, or ID"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: null, label: "All" }, ...statusOptions]}
            style={{ width: 150 }}
            allowClear
          />
        </Space>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <Card key={status} size="small" className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status === statusFilter ? null : status)}>
            <Badge color={statusColors[status]} text={<span className="capitalize text-sm">{status}</span>} />
            <div className="text-xl font-bold mt-1">
              {orders.filter((o) => o.status === status).length}
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          rowKey="_id"
          dataSource={filtered}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 800 }}
        />
      </div>

      <Modal
        title="Order Details"
        open={!!detailOrder}
        onCancel={() => setDetailOrder(null)}
        footer={null}
        width={600}
      >
        {detailOrder && (
          <div className="space-y-4">
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Order ID">{detailOrder._id}</Descriptions.Item>
              <Descriptions.Item label="Customer">{detailOrder.user?.name} ({detailOrder.user?.email})</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[detailOrder.status]}>{detailOrder.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(detailOrder.createdAt).toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Notes">{detailOrder.notes || "—"}</Descriptions.Item>
            </Descriptions>

            <Card title="Items" size="small">
              {detailOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b last:border-0">
                  <span>{item.productName}</span>
                  <span>Qty: {item.quantity} | Color: {item.color}</span>
                </div>
              ))}
            </Card>

            {detailOrder.shippingAddress && (
              <Card title="Shipping Address" size="small">
                <p>{detailOrder.shippingAddress.fullName}</p>
                <p>{detailOrder.shippingAddress.line1}</p>
                {detailOrder.shippingAddress.line2 && <p>{detailOrder.shippingAddress.line2}</p>}
                <p>{detailOrder.shippingAddress.city}, {detailOrder.shippingAddress.state} {detailOrder.shippingAddress.postalCode}</p>
                <p>{detailOrder.shippingAddress.country}</p>
                <p className="mt-2 text-gray-500">Phone: {detailOrder.shippingAddress.phone}</p>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Button({ icon, size, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
    >
      {icon}{children}
    </button>
  );
}
