import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../style/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://68ddc5fad7b591b4b78d6146.mockapi.io/products');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
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
