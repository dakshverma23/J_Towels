import { Table, Tag, Select, Input, Popconfirm, message, Space, Avatar } from "antd";
import { DeleteOutlined, SearchOutlined, UserOutlined, CrownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user: currentUser } = useAuth();

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/users");
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateRole = async (userId, role) => {
    await api.patch(`/admin/users/${userId}/role`, { role });
    message.success("Role updated");
    load();
  };

  const deleteUser = async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    message.success("User deleted");
    load();
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const columns = [
    {
      title: "User",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar icon={r.role === "admin" ? <CrownOutlined /> : <UserOutlined />} 
            className={r.role === "admin" ? "!bg-amber-500" : "!bg-blue-500"} />
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-gray-500">{r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      render: (_, r) => {
        if (r._id === currentUser?.id) {
          return <Tag color="gold">Admin (You)</Tag>;
        }
        return (
          <Select
            value={r.role}
            onChange={(v) => updateRole(r._id, v)}
            options={[
              { value: "customer", label: "Customer" },
              { value: "admin", label: "Admin" },
            ]}
            style={{ width: 120 }}
            size="small"
          />
        );
      },
    },
    {
      title: "Joined",
      render: (_, r) => new Date(r.createdAt).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Actions",
      render: (_, r) => {
        if (r._id === currentUser?.id || r.role === "admin") return <span className="text-gray-400 text-sm">Protected</span>;
        return (
          <Popconfirm title="Delete this user?" description="This action cannot be undone." onConfirm={() => deleteUser(r._id)}>
            <button className="text-red-500 hover:text-red-700 transition-colors">
              <DeleteOutlined /> Delete
            </button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} total users</p>
        </div>
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
          <div className="text-sm text-gray-500">Admins</div>
          <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Customers</div>
          <div className="text-2xl font-bold">{users.filter((u) => u.role === "customer").length}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Table
          rowKey="_id"
          dataSource={filtered}
          columns={columns}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </div>
  );
}
