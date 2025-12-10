import { createContext, useContext, useEffect, useState } from "react";
import * as cartApi from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [customerId, setCustomerId] = useState(null);

  // Decode token an toàn
  const decodeToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.customerID || null;
    } catch (e) {
      console.error("Decode token error:", e);
      return null;
    }
  };

  // Lấy customerId ngay khi load app
  useEffect(() => {
    setCustomerId(decodeToken());
  }, []);

  // Fetch giỏ hàng từ API
  const fetchCart = async () => {
    if (!customerId) return;

    try {
      const data = await cartApi.getCart(customerId);
      setCart(data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Fetch cart failed:", err);
      setCart({ items: [], totalPrice: 0 });
    }
  };

  // Load cart khi customerId có
  useEffect(() => {
    fetchCart();
  }, [customerId]);

  // Hàm reload cart
  const reloadCart = async () => {
    await fetchCart();
  };

  // ⭐⭐ ---- HÀM ADD TO CART ----- ⭐⭐
  const addToCart = async (productId, quantity = 1) => {
    if (!customerId) {
      throw new Error("Chưa đăng nhập!");
    }

    try {
      const res = await cartApi.addToCart({
        customerId,
        productId,
        quantity,
      });

      // Backend trả về cart? Nếu có → cập nhật
      if (res) {
        setCart(res);
      }

      // Nếu backend không trả cart, thì reload lại từ API
      await reloadCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        customerId,
        reloadCart,
        addToCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
