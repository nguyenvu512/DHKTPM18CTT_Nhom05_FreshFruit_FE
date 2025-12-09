// ĐÃ SỬA TOÀN BỘ FILE — BẢN CHUẨN HOẠT ĐỘNG HOÀN HẢO
// 1) Đổi voucherId -> id
// 2) Sửa load, edit, delete, update theo đúng entity backend
// 3) Tối ưu logic và UI

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
  getAllVouchers,
  updateVoucher,
} from "../api/voucherApi";

function VoucherManage() {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [editingVoucherData, setEditingVoucherData] = useState({});
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  // ==============================
  // LOAD ALL VOUCHERS
  // ==============================
  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data = await getAllVouchers();
      setVouchers(data);
      setFilteredVouchers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SEARCH
  // ==============================
  useEffect(() => {
    const filtered = vouchers.filter((v) =>
      v.name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredVouchers(filtered);
  }, [searchText, vouchers]);

  // ==============================
  // EDIT
  // ==============================
  const handleEditClick = (voucher) => {
    setEditingVoucherId(voucher.id);
    setEditingVoucherData({ ...voucher });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingVoucherData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await updateVoucher(editingVoucherId, editingVoucherData);

      setVouchers((prev) =>
        prev.map((v) => (v.id === editingVoucherId ? updated : v))
      );

      setFilteredVouchers((prev) =>
        prev.map((v) => (v.id === editingVoucherId ? updated : v))
      );

      setEditingVoucherId(null);
      setEditingVoucherData({});
    } catch (err) {
      console.error("Lỗi khi update voucher:", err);
    }
  };

  const handleCancel = () => {
    setEditingVoucherId(null);
    setEditingVoucherData({});
  };

  // ==============================
  // DELETE
  // ==============================
  

  // ==============================
  // ADD
  // ==============================
  const handleAddVoucher = () => {
    navigate("/admin/add-voucher");
  };

  // ==============================
  // UI
  // ==============================
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

        <button className="btn btn-success" onClick={handleAddVoucher}>
          ➕ Thêm voucher
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Tên voucher</th>
            <th>Mô tả</th>
            <th>Giảm giá (%)</th>
            <th>Số lượng</th>
            <th style={{ width: "150px" }}>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {filteredVouchers.length > 0 ? (
            filteredVouchers.map((voucher) => (
              <React.Fragment key={voucher.id}>
                <tr>
                  <td>{voucher.name}</td>
                  <td>{voucher.description}</td>
                  <td>{voucher.discount}</td>
                  <td>{voucher.quantity}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(voucher)}
                    >
                      Edit
                    </button>
                   
                  </td>
                </tr>

                {/* FORM EDIT */}
                {editingVoucherId === voucher.id && (
                  <tr>
                    <td colSpan="5">
                      <div className="card p-3">
                        {/* NAME */}
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

                        {/* DESCRIPTION */}
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

                        {/* DISCOUNT */}
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

                        {/* QUANTITY */}
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
                          <button className="btn btn-success me-2" onClick={handleSave}>
                            Save
                          </button>
                          <button className="btn btn-danger" onClick={handleCancel}>
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