import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductPreview = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/products");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data.slice(0, 8));
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-4">Đang tải sản phẩm…</div>;
  if (error) return <div className="text-center mt-4 text-danger">Lỗi: {error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        <span className="bg-warning text-white rounded-pill px-5 py-2 d-inline-block">
          Sản phẩm nổi bật
        </span>
      </h2>

      <div className="row">
        {products.map(product => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card h-100 text-center hover-shadow">
                {product.img && (
                  <img
                    src={product.img}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: "contain", width: "100%" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate mb-2" title={product.name}>
                    {product.name}
                  </h5>
                  <p className="text-success fw-bold mb-3">{product.price} đ</p>
                  <button className="btn btn-outline-warning mt-auto add-cart-btn">
                    Thêm giỏ hàng
                  </button>
                </div>
              </div>
            </Link>
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
