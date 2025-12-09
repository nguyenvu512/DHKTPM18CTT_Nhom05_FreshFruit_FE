import React, { useEffect, useState } from "react";
import addressData from "../data/address_data.json"; 

const AddressForm = ({ setAddress }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    province: "",
    commune: "",
    address: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    // Load danh sách tỉnh từ file JSON
    setProvinces(addressData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setAddress((prevData) => ({ ...prevData, [name]: value }));

    if (name === "province") {
      const selectedProvince = addressData.find(
        (p) => p.Code == value
      );

      if (selectedProvince) {
        setAddress((prevData) => ({
          ...prevData,
          province: selectedProvince.Name,
        }));

        setCommunes(selectedProvince.Wards || []);
        console.log(communes)
      } else {
        setCommunes([]);
      }
    }

    if (name === "commune") {
      const selectedCommune = communes.find(
        (c) => c.Code === value
      );

      if (selectedCommune) {
        setAddress((prevData) => ({
          ...prevData,
          commune: selectedCommune.Name,
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="container mt-2 mb-2 p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        THÔNG TIN GIAO HÀNG
      </h4>
      <hr />
      <form onSubmit={handleSubmit} className="row g-3">
        {/* họ tên */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="fullName"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Họ và tên:
          </label>
          <input
            type="text"
            className="form-control small-placeholder"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ tên người nhận"
            required
          />
        </div>

        {/* phone */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="phoneNumber"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Số điện thoại:
          </label>
          <input
            type="tel"
            className="form-control small-placeholder"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        {/* tỉnh */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="province"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Tỉnh/Thành Phố:
          </label>
          <select
            className="form-select"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="">Chọn Tỉnh/Thành Phố</option>
            {provinces.map((p) => (
              <option key={p.Code} value={p.Code}>
                {p.FullName}
              </option>
            ))}
          </select>
        </div>

        {/* xã/phường */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="commune"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Phường/Xã:
          </label>
          <select
            className="form-select"
            id="commune"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            required
          >
            <option value="">Chọn Phường/Xã</option>
            {communes.map((c) => (
              <option key={c.Code} value={c.Code}>
                {c.FullName}
              </option>
            ))}
          </select>
        </div>

        {/* địa chỉ */}
        <div className="col-12 d-flex align-items-center">
          <label
            htmlFor="address"
            className="form-label me-2 mb-0"
            style={{ width: "150px" }}
          >
            Địa chỉ nhận hàng:
          </label>
          <input
            type="text"
            className="form-control small-placeholder"
            id="address"
            name="address"
            onChange={handleChange}
            placeholder="Nhập địa chỉ nhận hàng"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
