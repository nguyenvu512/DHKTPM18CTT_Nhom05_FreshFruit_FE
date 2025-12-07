// src/page/VoucherManage.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function VoucherManage() {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [editingVoucherData, setEditingVoucherData] = useState({});
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/vouchers")
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy endpoint /vouchers");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) data = [];
        setVouchers(data);
        setFilteredVouchers(data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!Array.isArray(vouchers)) return;
    const filtered = vouchers.filter((v) =>
      v.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredVouchers(filtered);
  }, [searchText, vouchers]);

  const handleEditClick = (voucher) => {
    setEditingVoucherId(voucher.id);
    setEditingVoucherData({ ...voucher });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingVoucherData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === editingVoucherId ? editingVoucherData : v))
    );
    setEditingVoucherId(null);
    setEditingVoucherData({});
  };

  const handleCancel = () => {
    setEditingVoucherId(null);
    setEditingVoucherData({});
  };

  const handleAddVoucher = () => {
    navigate("/admin/vouchers/add");
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
          placeholder="Tìm kiếm voucher..."
          className="form-control me-2"
          style={{ maxWidth: "300px" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="btn btn-success d-flex align-items-center"
          onClick={handleAddVoucher}
        >
          <span className="me-1">➕</span> Thêm voucher
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Tên voucher</th>
            <th>Mô tả</th>
            <th>Giảm giá (%)</th>
            <th>Số lượng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredVouchers) && filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher) => (
              <React.Fragment key={voucher.id}>
                <tr>
                  <td>{voucher.name}</td>
                  <td>{voucher.description}</td>
                  <td>{voucher.discount}</td>
                  <td>{voucher.quantity}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleEditClick(voucher)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>

                {editingVoucherId === voucher.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="card p-3">
                        <div className="mb-2">
                          <label className="form-label">Tên voucher</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={editingVoucherData.name || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Mô tả</label>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={editingVoucherData.description || ""}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Giảm giá (%)</label>
                          <input
                            type="number"
                            className="form-control"
                            name="discount"
                            value={editingVoucherData.discount || 0}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Số lượng</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            value={editingVoucherData.quantity || 0}
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
                Không có voucher
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VoucherManage;
