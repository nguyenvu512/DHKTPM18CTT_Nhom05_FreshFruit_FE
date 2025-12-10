import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../api/productApi";
import * as cartApi from "../api/cartApi";
import { useCart } from "../context/CartContext";   // 👈 DÙNG CART CONTEXT
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { reloadCart } = useCart();  // 👈 DÙNG HÀM LOAD LẠI GIỎ HÀNG

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.slice(0, 8)); // Lấy 8 sản phẩm đầu
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
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ.");
      return;
    }

    const customerId = parseJwt(token)?.customerID;
    if (!customerId) {
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      await cartApi.addToCart({
        customerId,
        productId: product.id,
        quantity: 1,
      });

      toast.success(`Đã thêm "${product.name}" vào giỏ hàng.`);

      reloadCart(); // 👈 Cập nhật lại badge trong NavBar
    } catch (err) {
      console.error(err);
      toast.error("Thêm sản phẩm vào giỏ thất bại.");
    }
  };

  if (loading) return <div className="text-center mt-4">Đang tải sản phẩm…</div>;
  if (error)
    return <div className="text-center mt-4 text-danger">Lỗi: {error}</div>;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <h2 className="text-center mb-4">
        <span className="bg-warning text-white rounded-pill px-5 py-2 d-inline-block">
          Sản phẩm nổi bật
        </span>
      </h2>

      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <div className="card h-100 text-center p-2 hover-shadow d-flex flex-column">

              {/* Link chỉ bọc hình + tên + giá */}
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                className="text-decoration-none text-dark"
              >
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "180px",
                  }}
                />

                <h5 className="card-title text-truncate mt-2" title={product.name}>
                  {product.name}
                </h5>

                <p className="text-success fw-bold mb-2">
                  {product.price} đ
                </p>
              </Link>

              {/* Nút thêm giỏ hàng */}
              <button
                className="btn btn-outline-warning w-100 mt-auto"
                onClick={(e) => handleAddToCart(product, e)}
              >
                Thêm giỏ hàng
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <Link to="/products" className="btn btn-warning btn-lg px-5">
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default ProductPreview;
