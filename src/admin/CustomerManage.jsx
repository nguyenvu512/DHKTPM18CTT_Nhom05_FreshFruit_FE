// src/page/CustomerManage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function CustomerManage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingCustomerData, setEditingCustomerData] = useState({});
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/customers")
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy endpoint /customers");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) data = [];
        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Filter theo searchText
  useEffect(() => {
    if (!Array.isArray(customers)) return;
    const filtered = customers.filter((c) =>
      c.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchText, customers]);

  const handleEditClick = (customer) => {
    setEditingCustomerId(customer.id);
    setEditingCustomerData({ ...customer });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === editingCustomerId ? editingCustomerData : c))
    );
    setEditingCustomerId(null);
    setEditingCustomerData({});
  };

  const handleCancel = () => {
    setEditingCustomerId(null);
    setEditingCustomerData({});
  };

  const handleAddCustomer = () => {
    navigate("/add-customer");
  };

  if (loading) return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-danger">
        Lỗi khi tải dữ liệu: {error.message}
      </p>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          className="btn btn-success d-flex align-items-center"
          onClick={handleAddCustomer}
        >
          <span className="me-1">➕</span> Thêm khách hàng
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Tên khách hàng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <React.Fragment key={customer.id}>
                <tr>
                  <td>{customer.name}</td>
                  <td>{customer.address}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>

                {editingCustomerId === customer.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="card p-3">
                        <div className="mb-2">
                          <label className="form-label">Tên khách hàng</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={editingCustomerData.name || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Địa chỉ</label>
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={editingCustomerData.address || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Số điện thoại</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={editingCustomerData.phone || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={editingCustomerData.email || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="d-flex justify-content-center">
                          <button
                            className="btn btn-success me-2"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Không có khách hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerManage;
