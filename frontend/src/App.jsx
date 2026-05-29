import { Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./admin/AdminPage";
import PageTemplate from "./components/PageTemplate";
import { useAuth } from "./context/AuthContext";
import { pageContent } from "./data/pages";
import AppLayout from "./layout/AppLayout";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<PageTemplate content={pageContent.about} />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/facilities" element={<PageTemplate content={pageContent.facilities} />} />
        <Route path="/quality" element={<PageTemplate content={pageContent.quality} />} />
        <Route path="/careers" element={<PageTemplate content={pageContent.careers} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </AppLayout>
  );
}
