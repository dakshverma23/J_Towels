import { Card, Table, Tag, Empty, Spin } from "antd";
import { TagsOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CategoriesTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    api.get("/products")
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

  // Group products by category
  const categories = {};
  products.forEach((p) => {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  });

  const categoryList = Object.entries(categories).map(([name, items]) => ({
    name,
    count: items.length,
    products: items,
  }));

  const selectedProducts = selectedCategory
    ? categories[selectedCategory] || []
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          {categoryList.length} categories across {products.length} products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categoryList.map((cat) => (
          <Card
            key={cat.name}
            hoverable
            className={`cursor-pointer transition-all ${selectedCategory === cat.name ? "!border-blue-500 shadow-md" : ""}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <TagsOutlined className="text-blue-500 text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.count} product{cat.count > 1 ? "s" : ""}</p>
              </div>
              <Tag color="blue">{cat.count}</Tag>
            </div>
          </Card>
        ))}
      </div>

      {selectedCategory ? (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">
              Products in "{selectedCategory}"
            </h3>
          </div>
          <Table
            rowKey="_id"
            dataSource={selectedProducts}
            pagination={false}
            columns={[
              { title: "Name", dataIndex: "name" },
              { title: "Price", render: (_, r) => `$${r.price}` },
              { title: "Colors", render: (_, r) => r.colors?.map((c) => <Tag key={c}>{c}</Tag>) },
              { title: "Stock", render: (_, r) => <Tag color={r.inStock ? "green" : "red"}>{r.inStock ? "In Stock" : "Out"}</Tag> },
            ]}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Empty description="Select a category to view its products" />
        </div>
      )}
    </div>
  );
}
