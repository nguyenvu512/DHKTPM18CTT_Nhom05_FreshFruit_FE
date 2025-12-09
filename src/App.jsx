import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./page/Home";
import ProductPage from "./page/ProductPage";
import DetailPage from "./page/DetailPage";
import AdminPage from "./admin/AdminPage";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductManage from "./admin/ProductManage";
import EditProduct from "./admin/AddProduct";
import AddProduct from "./admin/AddProduct";
import AddCustomer from "./admin/AddCustomer";
import AddVoucher from "./admin/AddVoucher";
import CustomerManage from "./admin/CustomerManage";
import VoucherManage from "./admin/VoucherManage";
import Login from "./page/Login";
import Register from "./page/Register";
import ForgetPassword from "./page/ForgetPassword";
import ProfilePage from "./page/ProfilePage";
import CartPage from "./page/CartPage";
import CategoryManage from "./admin/CategoryManage";
function App() {
  return (
    // Đây là nơi Router "bọc" toàn bộ ứng dụng
    <BrowserRouter>
      <NavBar></NavBar>
      <Routes>
        <Route path="/admin" element={<AdminPage />}>
          <Route path="products" element={<ProductManage />} />
          <Route path="customers" element={<CustomerManage />} />
          <Route path="vouchers" element={<VoucherManage />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="/admin/categories" element={<CategoryManage />} />
          <Route path="add-customer" element={<AddCustomer />} />
          <Route path="add-voucher" element={<AddVoucher />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
