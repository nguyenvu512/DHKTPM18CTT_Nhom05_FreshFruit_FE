import api from "./axiosInstance";

// Lấy giỏ hàng theo customerId
export const getCart = async (customerId) => {
  try {
    const res = await api.get(`/carts/${customerId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching cart:", err);
    throw err;
  }
};

// Thêm sản phẩm vào giỏ
export const addToCart = async ({ customerId, productId, quantity }) => {
  try {
    const res = await api.post("/carts/add", { customerId, productId, quantity });
    return res.data;
  } catch (err) {
    console.error("Error adding to cart:", err);
    throw err;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async ({ customerId, productId, quantity }) => {
  try {
    const res = await api.put("/carts/update", { customerId, productId, quantity });
    return res.data;
  } catch (err) {
    console.error("Error updating cart item:", err);
    throw err;
  }
};

// Xóa sản phẩm khỏi giỏ
export const removeCartItem = async (customerId, productId) => {
  try {
    const res = await api.delete(`/carts/remove/${customerId}/${productId}`);
    return res.data;
  } catch (err) {
    console.error("Error removing cart item:", err);
    throw err;
  }
};

// Xóa tất cả sản phẩm trong giỏ
export const clearCart = async (customerId) => {
  try {
    const res = await api.delete(`/carts/clear/${customerId}`);
    return res.data;
  } catch (err) {
    console.error("Error clearing cart:", err);
    throw err;
  }
};
