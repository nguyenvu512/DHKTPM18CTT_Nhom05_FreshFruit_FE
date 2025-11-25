// src/page/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    inventory: 0,
    img: "",
    origin: "",
    category: "",
  });

  const [preview, setPreview] = useState(null); // preview ảnh

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setProduct({ ...product, img: reader.result }); // lưu base64 vào img
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then(() => {
        alert("Thêm sản phẩm thành công!");
        navigate("/product-manage");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: "50px" }}>
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">Thêm sản phẩm mới</h3>

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

        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            className="form-select"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="Fruits">Trái cây</option>
            <option value="Vegetables">Rau củ</option>
            <option value="Drinks">Đồ uống</option>
            <option value="Snacks">Đồ ăn vặt</option>
            {/* Thêm các danh mục khác nếu cần */}
          </select>
        </div>

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
          <div>
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
        </div>

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
