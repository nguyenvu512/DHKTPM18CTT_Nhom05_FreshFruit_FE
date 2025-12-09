import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/ProductList.css";
import { getAllProducts } from "../api/productApi";
import * as cartApi from "../api/cartApi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Hàm decode JWT
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

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getAllProducts();
        setProducts(result);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.", { position: "top-right" });
      return;
    }
    const customerId = parseJwt(token)?.customerID;
    if (!customerId) {
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.", { position: "top-right" });
      return;
    }

    try {
      await cartApi.addToCart({ customerId, productId: product.id, quantity: 1 });
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng.`, { position: "top-right" });
    } catch (err) {
      console.error(err);
      toast.error("Thêm sản phẩm vào giỏ thất bại.", { position: "top-right" });
    }
  };

  if (loading)
    return <div className="text-center mt-4">Đang tải sản phẩm…</div>;
  if (error)
    return <div className="text-center mt-4 text-danger">Lỗi: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <div className="card h-100 text-center hover-shadow d-flex flex-column p-2">
              
              {/* Link chỉ bọc hình + tên + giá */}
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].url}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: "cover", width: "100%", height: "250px" }}
                  />
                )}
                <h5 className="card-title text-truncate mt-2" title={product.name} style={{ fontSize: "1.5rem" }}>
                  {product.name}
                </h5>
                <p className="text-success fw-bold mb-2">{product.price} đ</p>
              </Link>

              {/* Nút thêm giỏ hàng riêng */}
              <button
                className="btn add-cart-btn mt-auto"
                onClick={(e) => handleAddToCart(product, e)}
              >
                Thêm giỏ hàng
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default ProductList;
