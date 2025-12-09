// src/page/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { createProduct } from "../api/productApi"; // Đảm bảo đường dẫn đúng

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    inventory: 0,
    origin: "",
    categoryId: "",
    imgFile: null, // đổi tên img → imgFile
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProduct({ ...product, imgFile: file });
    }
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
      formData.append("category", product.categoryId); // phải trùng tên param backend
      if (product.imgFile) {
        // Nếu backend mong "images" là mảng MultipartFile
        formData.append("images", product.imgFile);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await createProduct(formData); // nhớ backend nhận FormData
      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại! Kiểm tra console.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "50px" }}
    >
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">Thêm sản phẩm mới</h3>

        {/* Tên sản phẩm */}
        <div className="mb-3">
          <label className="form-label">Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
        </div>

        {/* Giá */}
        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        {/* Số lượng tồn */}
        <div className="mb-3">
          <label className="form-label">Số lượng tồn</label>
          <input
            type="number"
            className="form-control"
            name="inventory"
            value={product.inventory}
            onChange={handleChange}
          />
        </div>

        {/* Xuất xứ */}
        <div className="mb-3">
          <label className="form-label">Xuất xứ</label>
          <input
            type="text"
            className="form-control"
            name="origin"
            value={product.origin}
            onChange={handleChange}
          />
        </div>

        {/* Select Category */}
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="1">Trái cây</option>
            <option value="2">Rau củ</option>
            <option value="3">Đồ uống</option>
            <option value="4">Đồ ăn vặt</option>
          </select>
        </div>

        {/* Ảnh sản phẩm */}
        <label className="form-label">Ảnh sản phẩm</label>
        <div className="mb-3 d-flex align-items-center">
          <div style={{ width: "100px", height: "100px", marginRight: "10px" }}>
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className="border w-100 h-100 d-flex justify-content-center align-items-center">
                Preview
              </div>
            )}
          </div>
          <label className="btn btn-primary mb-0">
            Upload File
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
