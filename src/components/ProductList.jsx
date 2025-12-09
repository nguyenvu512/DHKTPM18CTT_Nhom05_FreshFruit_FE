import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../style/ProductList.css";
import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
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

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCate, setSelectedCate] = useState("all");

  const [loading, setLoading] = useState(true);

  // PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // số sản phẩm mỗi trang

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filterProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);

        setProducts(productRes);
        setCategories(categoryRes);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const params = new URLSearchParams(location.search);
    const cateId = params.get("category");

    if (!cateId) {
      setSelectedCate("all");
      setFilterProducts(products);
      return;
    }

    setSelectedCate(cateId);
    const filtered = products.filter(
      (p) => String(p.category) === String(cateId)
    );
    setFilterProducts(filtered);
    setCurrentPage(1); // reset trang về 1 khi thay đổi filter
  }, [location.search, products]);

  const handleFilterCategory = (cateId) => {
    setSelectedCate(cateId);

    if (cateId === "all") {
      navigate("/products");
      setFilterProducts(products);
    } else {
      navigate(`/products?category=${cateId}`);
    }
  };

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
      toast.success(`Đã thêm "${product.name}" vào giỏ.`);
    } catch {
      toast.error("Thêm sản phẩm vào giỏ thất bại.");
    }
  };

  if (loading)
    return <div className="text-center mt-4">Đang tải sản phẩm…</div>;

  const totalPages = Math.ceil(filterProducts.length / itemsPerPage);

  return (
    <div className="container mt-4">
      {/* CATEGORY BAR */}
      <div className="d-flex gap-3 mb-4" style={{ overflowX: "auto" }}>
        <button
          className={`btn px-3 py-2 ${
            selectedCate === "all" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => handleFilterCategory("all")}
        >
          Tất cả
        </button>

        {categories.map((cate) => (
          <button
            key={cate.id}
            className={`btn px-3 py-2 ${
              String(selectedCate) === String(cate.id)
                ? "btn-success"
                : "btn-outline-success"
            }`}
            onClick={() => handleFilterCategory(cate.id)}
          >
            {cate.name}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      <div className="row">
        {currentProducts.map((product) => (
          <div key={product.id} className="col-6 col-md-3 mb-4">
            <div className="card h-100 text-center p-2 d-flex flex-column">
              <Link
                to={`/product/${product.id}`}
                state={{ product }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {product.images?.length > 0 && (
                  <img
                    src={product.images[0].url}
                    className="card-img-top"
                    alt={product.name}
                    style={{ objectFit: "cover", height: "250px" }}
                  />
                )}

                <h5 className="card-title text-truncate mt-2">
                  {product.name}
                </h5>

                <p className="fw-bold text-success">{product.price} đ</p>
              </Link>

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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`btn ${
                currentPage === i + 1 ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductList;
