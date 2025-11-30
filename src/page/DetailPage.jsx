// src/pages/DetailPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../components/Navbar";

function DetailPage() {
  const location = useLocation();
  const { product } = location.state || {}; // nhận data từ ProductList
  const [quantity, setQuantity] = useState(1);

  if (!product)
    return <div className="text-center mt-4">Không có dữ liệu sản phẩm</div>;

  return (
    <div className="container mt-5">
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
                objectFit: "conver",
              }}
            />
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          {/* Tên sản phẩm đổi màu warning */}
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

          {/* Thêm vào giỏ, button warning */}
          <button className="btn btn-warning btn-lg w-100">THÊM VÀO GIỎ</button>
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
