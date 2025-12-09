import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getAllProducts } from "../api/productApi";
import { getCustomers } from "../api/customerApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCustomers();
    loadFakeRevenueChart();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Lỗi tải khách hàng:", error);
    }
  };

  // Fake doanh thu theo tháng
  const loadFakeRevenueChart = () => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
      "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
      "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const fakeData = months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 5000000) + 1000000, // từ 1 triệu đến 6 triệu
    }));

    setChartData(fakeData);
  };

  // Hàm format số tiền, ví dụ: 1.500.000 => 1.5M
  const formatCurrency = (value) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M đ";
    if (value >= 1000) return (value / 1000).toFixed(0) + "K đ";
    return value + " đ";
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f1f3f5" }}>
      {/* Sidebar */}
      <aside className="bg-dark text-white p-4" style={{ width: "270px", minHeight: "100vh" }}>
        <h2 className="fw-bold mb-4">Admin Panel</h2>
        <ul className="list-group list-group-flush">
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin")}>
              Tổng quan
            </button>
          </li>
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin/products")}>
              Quản lý sản phẩm
            </button>
          </li>
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin/orders")}>
              Quản lý đơn hàng
            </button>
          </li>
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin/categories")}>
              Quản lý danh mục
            </button>
          </li>
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin/customers")}>
              Quản lý khách hàng
            </button>
          </li>
          <li className="list-group-item bg-dark text-white border-0 ps-0">
            <button className="btn btn-dark w-100 text-start" onClick={() => navigate("/admin/vouchers")}>
              Quản lý khuyến mãi
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        {window.location.pathname === "/admin" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">Thống kê</h1>
            </div>

            {/* Stats Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card p-3 text-white" style={{ background: "#60a5fa" }}>
                  <h5>Tổng sản phẩm</h5>
                  <p className="fs-3 fw-bold">{products.length}</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 text-dark" style={{ background: "#2dd4bf" }}>
                  <h5>Tổng khách hàng</h5>
                  <p className="fs-3 fw-bold">{customers.length}</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 text-dark" style={{ background: "#fde047" }}>
                  <h5>Đơn hàng</h5>
                  <p className="fs-3 fw-bold">1,245</p>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card p-3 text-white" style={{ background: "#f87171" }}>
                  <h5>Doanh thu</h5>
                  <p className="fs-3 fw-bold">12,540,000đ</p>
                </div>
              </div>
            </div>

            {/* Line Chart - doanh thu theo tháng */}
            <div className="card p-4">
              <h5 className="fw-bold mb-3">Doanh thu theo tháng</h5>
              <div style={{ width: "100%", height: "400px" }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" interval={0} angle={0} textAnchor="end" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={formatCurrency} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        <Outlet />
      </main>
    </div>
  );
}
