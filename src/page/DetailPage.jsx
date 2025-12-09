// src/pages/DetailPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import * as cartApi from "../api/cartApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function DetailPage() {
  const location = useLocation();
  const { product } = location.state || {}; // nhận data từ ProductList
  const [quantity, setQuantity] = useState(1);

  if (!product)
    return <div className="text-center mt-4">Không có dữ liệu sản phẩm</div>;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
      return;
    }

    const customerId = parseJwt(token)?.customerID;
    if (!customerId) {
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await cartApi.addToCart({ customerId, productId: product.id, quantity });
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
        {/* Ảnh sản phẩm */}
        <div className="col-md-6 text-center">
          {product.images && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="img-fluid rounded shadow"
              style={{
                maxHeight: "400px",
                width: "400px",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2 className="text-warning">{product.name}</h2>
          <p>
            Mã sản phẩm: <strong>{product.id}</strong> | Tình trạng:{" "}
            {product.inventory > 0 ? (
              <span className="text-success">Còn hàng</span>
            ) : (
              <span className="text-danger">Hết hàng</span>
            )}
          </p>

          {/* Mã giảm giá */}
          <div className="mb-3">
            <h5 className="text-warning">Mã giảm giá</h5>
            <button className="btn btn-light me-2">FREESHIP40K</button>
            <button className="btn btn-light">FREESHIPMF</button>
          </div>

          {/* Giá */}
          <h3 className="text-danger mb-3">{product.price} đ</h3>

          {/* Chọn số lượng */}
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

          {/* Thêm vào giỏ */}
          <button
            className="btn btn-warning btn-lg w-100"
            onClick={handleAddToCart}
          >
            THÊM VÀO GIỎ
          </button>
        </div>
      </div>

      {/* Mô tả sản phẩm */}
      {product.description && (
        <div className="mt-5">
          <h4 className="text-warning">Mô tả sản phẩm</h4>
          <p>{product.description}</p>
          <p>{product.origin}</p>
        </div>
      )}
    </div>
  );
}

export default DetailPage;
