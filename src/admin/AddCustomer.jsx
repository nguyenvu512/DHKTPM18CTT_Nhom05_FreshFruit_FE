
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AddCustomer() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSave = () => {
    fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then(() => {
        alert("Thêm khách hàng thành công!");
        navigate("/customer-manage");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginTop: "50px" }}>
      <div className="card p-4" style={{ width: "500px" }}>
        <h3 className="text-center mb-4">Thêm khách hàng mới</h3>

        <div className="mb-3">
          <label className="form-label">Tên khách hàng</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={customer.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={customer.address}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={customer.email}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-success me-2" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate("/admin/customers")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
