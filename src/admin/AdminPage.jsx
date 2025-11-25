import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; // Thêm Outlet
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
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://68ddc5fad7b591b4b78d6146.mockapi.io/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          name: item.name,
          sales: item.sales,
        }));
        setChartData(formatted);
      });
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f1f3f5" }}>
      {/* Sidebar */}
      <aside className="bg-dark text-white p-4" style={{ width: "270px", minHeight: "100vh" }}>
        <h2 className="fw-bold mb-4">Admin Panel</h2>
        <ul className="list-group list-group-flush">
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

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        {/* Nếu URL là /admin thì hiện thống kê */}
        {window.location.pathname === "/admin" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">Thống kê</h1>
            </div>

            {/* Stats cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card p-3 text-white" style={{ background: "#60a5fa" }}>
                  <h5>Sản phẩm bán chạy</h5>
                  <p className="fs-3 fw-bold">9,823</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-white" style={{ background: "#2dd4bf" }}>
                  <h5>Doanh thu</h5>
                  <p className="fs-3 fw-bold">12,540,000đ</p>
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
                  <h5>Khách hàng mới</h5>
                  <p className="fs-3 fw-bold">892</p>
                </div>
              </div>
            </div>

            {/* Line chart */}
            <div className="card p-4">
              <h5 className="fw-bold mb-3">Biểu đồ lượt bán sản phẩm</h5>
              <div style={{ width: "100%", height: "350px" }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Outlet sẽ render ProductManage / CustomerManage / VoucherManage */}
        <Outlet />
      </main>
    </div>
  );
}
