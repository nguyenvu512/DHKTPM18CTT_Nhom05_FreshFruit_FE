import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./page/Home";
import ProductPage from "./page/ProductPage";
import DetailPage from "./page/DetailPage";

function App() {
  return (
    // Đây là nơi Router "bọc" toàn bộ ứng dụng
    <BrowserRouter>
   
        <Routes>
          <Route path="/" element={<Home />} />          {/* Trang chủ */}
          <Route path="/products" element={<ProductPage />} />  {/* Trang sản phẩm */}
          <Route path="/product/:id" element={<DetailPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
