import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product, quantity, color) => {
    setItems((prev) => [...prev, { product, quantity: Number(quantity), color }]);
  };

  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));
  const clear = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return <CartContext.Provider value={{ items, addToCart, removeItem, clear, totalItems }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
