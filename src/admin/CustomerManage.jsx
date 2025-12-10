// src/page/CustomerManage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { getCustomers } from "../api/customerAPI";

function CustomerManage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editingCustomerData, setEditingCustomerData] = useState({});
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  // ================= LOAD CUSTOMERS =================
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
        setFilteredCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khách hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = customers.filter((c) =>
      c.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchText, customers]);

  // ================= EDIT =================
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
    navigate("/admin/customers/add");
  };

  // ================= UI STATES =================
  if (loading) {
    return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-danger">{error}</p>;
  }

  // ================= UI =================
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
          {filteredCustomers.length > 0 ? (
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
                        {["name", "address", "phone", "email"].map((field) => (
                          <div className="mb-2" key={field}>
                            <label className="form-label">
                              {field.toUpperCase()}
                            </label>
                            <input
                              className="form-control"
                              name={field}
                              value={editingCustomerData[field] || ""}
                              onChange={handleChange}
                            />
                          </div>
                        ))}

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
