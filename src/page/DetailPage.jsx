// src/pages/DetailPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ KHÔNG import CartContext nữa
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DetailPage() {
  const location = useLocation();
  const { product } = location.state || {};
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart(); // ✅ LẤY addToCart đúng cách

  if (!product)
    return <div className="text-center mt-4">Không có dữ liệu sản phẩm</div>;

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity);
      toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng.`);
    } catch (err) {
      console.error(err);
      toast.error("Thêm sản phẩm vào giỏ thất bại.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <div className="row">
        <div className="col-md-6 text-center">
          {product.images && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="img-fluid rounded shadow"
            />
          )}
        </div>

        <div className="col-md-6">
          <h2 className="text-warning">{product.name}</h2>

          <h3 className="text-danger mb-3">
            {product.price.toLocaleString()} đ
          </h3>

          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>

            <input
              type="text"
              value={quantity}
              readOnly
              className="form-control text-center mx-2"
              style={{ width: "60px" }}
            />

            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-warning btn-lg w-100"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
