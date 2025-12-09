// src/page/AddProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { createProduct } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    inventory: 0,
    origin: "",
    categoryId: "",
    description: "",
    imgFiles: [],
  });
  const [previewImages, setPreviewImages] = useState([]);

  // Load categories từ backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setProduct((prev) => ({
      ...prev,
      imgFiles: [...prev.imgFiles, ...files],
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      imgFiles: prev.imgFiles.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!product.name || !product.price || !product.categoryId) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("inventory", product.inventory);
      formData.append("origin", product.origin);
      formData.append("category", product.categoryId);
      formData.append("description", product.description);

      product.imgFiles.forEach((file) => formData.append("images", file));

      await createProduct(formData);
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại! Kiểm tra console.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow" style={{ maxWidth: "700px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Thêm sản phẩm mới</h3>

          <div className="mb-3">
            <label className="form-label">Tên sản phẩm *</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Giá *</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Số lượng tồn</label>
            <input
              type="number"
              className="form-control"
              name="inventory"
              value={product.inventory}
              onChange={handleChange}
              placeholder="Nhập số lượng tồn"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Xuất xứ</label>
            <input
              type="text"
              className="form-control"
              name="origin"
              value={product.origin}
              onChange={handleChange}
              placeholder="Nhập xuất xứ"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Danh mục *</label>
            <select
              className="form-select"
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Mô tả sản phẩm</label>
            <textarea
              className="form-control"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập mô tả sản phẩm"
              style={{ resize: "vertical", overflowY: "auto" }} // <-- thêm
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Ảnh sản phẩm</label>
            <div className="d-flex flex-wrap gap-3">
              {previewImages.map((src, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={src}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      lineHeight: "18px",
                      textAlign: "center",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              <label
                style={{
                  width: "120px",
                  height: "120px",
                  border: "2px dashed #0d6efd",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#0d6efd",
                  fontSize: "24px",
                  fontWeight: "bold",
                  transition: "0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#e7f1ff")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                +
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-center mt-4 gap-2">
            <button
              className="btn btn-warning"
              style={{ width: "120px" }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="btn btn-danger"
              style={{ width: "120px" }}
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
