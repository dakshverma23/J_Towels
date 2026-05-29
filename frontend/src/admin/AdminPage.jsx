import { BarChartOutlined, ShoppingCartOutlined, UserOutlined, AppstoreOutlined, TagsOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useState } from "react";
import DashboardTab from "./tabs/DashboardTab";
import ProductsTab from "./tabs/ProductsTab";
import OrdersTab from "./tabs/OrdersTab";
import UsersTab from "./tabs/UsersTab";
import CategoriesTab from "./tabs/CategoriesTab";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
  { key: "products", icon: <AppstoreOutlined />, label: "Products" },
  { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "users", icon: <UserOutlined />, label: "Users" },
  { key: "categories", icon: <TagsOutlined />, label: "Categories" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardTab />;
      case "products": return <ProductsTab />;
      case "orders": return <OrdersTab />;
      case "users": return <UsersTab />;
      case "categories": return <CategoriesTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <Layout className="min-h-[calc(100vh-64px)]">
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          theme="light"
          className="!bg-white border-r border-gray-200"
          style={{ position: "sticky", top: 64, height: "calc(100vh - 64px)" }}
        >
          <div className="p-4 text-center border-b border-gray-100">
            <h2 className={`font-semibold text-gray-800 transition-all ${collapsed ? "text-xs" : "text-lg"}`}>
              {collapsed ? "JT" : "Admin Panel"}
            </h2>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            onClick={({ key }) => setActiveTab(key)}
            items={menuItems}
            className="border-none mt-2"
          />
        </Sider>
        <Content className="p-6 md:p-8">
          {renderTab()}
        </Content>
      </Layout>
    </div>
  );
}
