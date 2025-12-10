import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getAllProducts } from "../api/productApi";
import { getCustomers } from "../api/customerApi";
import { getAllOrder } from "../api/orderApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadCustomers();
    loadOrders();
  }, []);

  // ========================= LOAD DATA =========================
  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.result ?? res ?? []);
    } catch (e) {
      console.error("Lỗi load sản phẩm:", e);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.result ?? res ?? []);
    } catch (e) {
      console.error("Lỗi load khách hàng:", e);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getAllOrder();
      const list = Array.isArray(res.result) ? res.result : [];
      setOrders(list);
      loadRevenueChart(list);
    } catch (e) {
      console.error("Lỗi load đơn hàng:", e);
    }
  };

  // ========================= CHART =========================
  const loadRevenueChart = (orderList) => {
    const byMonth = Array(12).fill(0);

    orderList.forEach((o) => {
      const d = new Date(o.orderDate);
      const m = d.getMonth();
      byMonth[m] += o.totalAmount ?? 0;
    });

    const labels = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12",
    ];

    const chart = labels.map((m, i) => ({
      month: m,
      revenue: byMonth[i],
    }));

    setChartData(chart);
  };

  // Format đơn vị VNĐ
  const formatMoney = (v) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
    if (v >= 1_000) return (v / 1_000).toFixed(0) + "K";
    return v;
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0);

  // ========================== UI ==============================
  return (
    <div className="d-flex" style={{ background: "#f6f7fb", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "#111827",
          color: "white",
          padding: "25px 18px",
          boxShadow: "4px 0 12px rgba(0,0,0,0.15)",
        }}
      >
        <h3 className="fw-bold mb-4">📊 Admin Dashboard</h3>

        {[
          { label: "Tổng quan", path: "/admin" },
          { label: "Sản phẩm", path: "/admin/products" },
          { label: "Đơn hàng", path: "/admin/orders" },
          { label: "Danh mục", path: "/admin/categories" },
          { label: "Khách hàng", path: "/admin/customers" },
          { label: "Khuyến mãi", path: "/admin/vouchers" },
        ].map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              padding: "12px 15px",
              borderRadius: 10,
              cursor: "pointer",
              marginBottom: 6,
              background:
                window.location.pathname === item.path ? "#1f2937" : "transparent",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1f2937")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                window.location.pathname === item.path ? "#1f2937" : "transparent")
            }
          >
            {item.label}
          </div>
        ))}
      </aside>

      {/* MAIN */}
      <main className="flex-grow-1 p-4">
        {/* Top Bar */}
        <div
          className="d-flex justify-content-between align-items-center mb-4"
          style={{
            background: "white",
            padding: "14px 20px",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h2 className="fw-bold">Quản trị hệ thống</h2>
        </div>

        {window.location.pathname === "/admin" && (
          <>
            {/* CARDS */}
            <div className="row g-3 mb-4">
              {[
                { label: "Sản phẩm", value: products.length, color: "#2563eb" },
                { label: "Khách hàng", value: customers.length, color: "#0ea5e9" },
                { label: "Đơn hàng", value: orders.length, color: "#f59e0b" },
                {
                  label: "Doanh thu",
                  value: totalRevenue.toLocaleString() + " đ",
                  color: "#ef4444",
                },
              ].map((card, i) => (
                <div className="col-md-3" key={i}>
                  <div
                    className="card text-white p-3"
                    style={{
                      background: card.color,
                      borderRadius: 16,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    }}
                  >
                    <h6>{card.label}</h6>
                    <p className="fs-3 fw-bold">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CHART */}
            <div
              className="card p-4 shadow-sm"
              style={{ borderRadius: 20, background: "white" }}
            >
              <h5 className="fw-bold mb-3">📈 Doanh thu theo tháng</h5>

              <div className="w-full" style={{ height: 380 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                    barSize={45}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#374151", fontSize: 13 }}
                      axisLine={false}
                    />

                    <YAxis
                      tickFormatter={(v) => formatMoney(v) + " đ"}
                      tick={{ fill: "#374151", fontSize: 13 }}
                      axisLine={false}
                    />

                    <Tooltip
                      formatter={(v) => v.toLocaleString() + " đ"}
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        padding: 10,
                      }}
                    />

                    <Bar
                      dataKey="revenue"
                      radius={[12, 12, 0, 0]}
                      fill="#6366f1"
                      animationDuration={900}
                    />
                  </BarChart>
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
