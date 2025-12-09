import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import * as cartApi from "../api/cartApi";
import { getProductById } from "../api/productApi";
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
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
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

  if (!product)
    return <div className="text-center mt-4">Đang tải sản phẩm…</div>;

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
        {/* Hình ảnh */}
        <div className="col-md-6 text-center">
          {mainImage ? (
            <>
              <img
                src={mainImage.url}
                alt={product.name}
                className="img-fluid rounded shadow mb-3"
                style={{
                  maxHeight: "400px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />

              <div className="d-flex flex-wrap justify-content-center gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        img.url === mainImage.url
                          ? "2px solid orange"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </>
          ) : (
            <p>Không có hình ảnh.</p>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="col-md-6">
          <h2 className="text-warning mb-3">{product.name}</h2>
          <p>
            Tình trạng:{" "}
            {product.inventory > 0 ? (
              <span className="text-success">Còn {product.inventory}kg</span>
            ) : (
              <span className="text-danger">Hết hàng</span>
            )}
          </p>
          {product.origin && (
            <p>
              <strong>Nguồn gốc:</strong> {product.origin}
            </p>
          )}

          <h3 className="text-danger mb-3">
            {new Intl.NumberFormat("vi-VN").format(product.price)} đ / 1kg
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
