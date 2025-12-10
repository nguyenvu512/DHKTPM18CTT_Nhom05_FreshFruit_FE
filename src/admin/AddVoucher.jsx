// src/page/AddVoucher.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVoucher } from "../api/voucherApi"; // 👈 import API
import "bootstrap/dist/css/bootstrap.min.css";

function AddVoucher() {
  const navigate = useNavigate();

  const [voucher, setVoucher] = useState({
    name: "",
    description: "",
    discount: 0,
    quantity: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucher({ ...voucher, [name]: value });
  };

  const handleSave = async () => {
    try {
      await createVoucher(voucher); // 👈 gọi API
      alert("Thêm voucher thành công!");
      navigate("/admin/vouchers");
    } catch (error) {
      console.error("Lỗi khi thêm voucher:", error);
      alert("Thêm thất bại!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "50px" }}
    >
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">Thêm voucher mới</h3>

        <div className="mb-3">
          <label className="form-label">Tên voucher</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={voucher.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={voucher.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Giảm giá (%)</label>
          <input
            type="number"
            className="form-control"
            name="discount"
            value={voucher.discount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={voucher.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate("/admin/vouchers")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddVoucher;
