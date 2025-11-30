import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/ProductList.css";
import { getAllProducts } from "../api/productApi";

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

  if (loading)
    return <div className="text-center mt-4">Đang tải sản phẩm…</div>;
  if (error)
    return <div className="text-center mt-4 text-danger">Lỗi: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card h-100 text-center hover-shadow">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].url}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                      objectFit: "conver",
                      width: "100%",
                      height: "250px",
                    }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title text-truncate mb-2"
                    title={product.name}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {product.name}
                  </h5>
                  <p className="text-success fw-bold mb-3">{product.price} đ</p>
                  <button className="btn add-cart-btn mt-auto">
                    Thêm giỏ hàng
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
