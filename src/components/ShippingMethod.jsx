import React, { useState } from "react";

const ShippingMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("standard");

  // Lấy ngày hiện tại và thêm 3 ngày
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 2);
  const formattedDate = deliveryDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  return (
    <div
      className="container mb-2 p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        PHƯƠNG THỨC VẬN CHUYỂN
      </h4>
      <hr />
      <div className="form-check">
        <input
          className="form-check-input me-2"
          type="checkbox"
          id="standard"
          value="standard"
          checked={selectedMethod === "standard"}
          onChange={handleChange}
        />
        <label
          className="form-check-label"
          htmlFor="standard"
          style={{ fontWeight: 600 }}
        >
          Giao hàng tiêu chuẩn: 20.000 đ
        </label>
        <p className="text-muted">Ngày giao dự kiến: {formattedDate}</p>
      </div>
    </div>
  );
};
export default ShippingMethod;