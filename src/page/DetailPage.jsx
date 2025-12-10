// src/pages/DetailPage.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ KHÔNG import CartContext nữa
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { product } = location.state || {};
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    if (location.state?.product && location.state.product.id === id) {
      setProduct(location.state.product);
      setMainImage(location.state.product.images?.[0] || null);
    } else {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          setProduct(data);
          setMainImage(data.images?.[0] || null);
        } catch (err) {
          console.error(err);
          toast.error("Không thể tải dữ liệu sản phẩm.");
        }
      };
      fetchProduct();
    }
  }, [id, location.state]);

  const { addToCart } = useCart(); // ✅ LẤY addToCart đúng cách

  if (!product)
    return <div className="text-center mt-4">Đang tải sản phẩm…</div>;

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
            className="btn btn-warning btn-lg w-100 mb-4"
            onClick={handleAddToCart}
            disabled={product.inventory <= 0}
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              color: product.inventory > 0 ? "#fff" : "#ccc",
              textTransform: "uppercase",
            }}
          >
            {product.inventory > 0 ? "THÊM VÀO GIỎ" : "HẾT HÀNG"}
          </button>
          {/* Mô tả và nguồn gốc */}
          {product.description || product.origin ? (
            <div className="mt-4">
              {product.description && (
                <>
                  <h5 className="text-warning">Mô tả sản phẩm</h5>
                  <p>{product.description}</p>
                </>
              )}
            </div>
          ) : (
            <p>Chưa có mô tả sản phẩm.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
