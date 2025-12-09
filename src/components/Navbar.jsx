import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiShoppingCart,
  FiLogOut,
  FiSettings
} from "react-icons/fi";
import "../style/NavBar.css";

import * as cartApi from "../api/cartApi";

// Decode JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function NavBar() {
  const [customerName, setCustomerName] = useState(null);
  const [role, setRole] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const payload = parseJwt(token);

      if (payload) {
        setCustomerName(payload.customerName || null);
        setRole(payload.scope || null);
        setCustomerId(payload.customerID || null);
      }
    }
  }, []);

  // Load cart khi có customerId
  useEffect(() => {
    if (!customerId) return;

    const fetchCart = async () => {
      try {
        const res = await cartApi.getCart(customerId);

        if (!res || !res.items) {
          setCartCount(0);
          return;
        }

        const total = res.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.error("Lỗi load cart:", err);
      }
    };

    fetchCart();
  }, [customerId]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCustomerName(null);
    setRole(null);
    setCustomerId(null);
    window.location.href = "/";
  };

  return (
    <Navbar bg="warning" expand="lg" className="py-2 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text fw-bold">
          FreshFruits
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          {/* Search */}
          <Form className="d-flex mx-auto my-2 my-lg-0 w-50">
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
            />
          </Form>

          <Nav className="ms-auto fw-semibold">

            {/* Nếu đã login */}
            {customerName ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={Button}
                  variant="link"
                  className="text-dark mx-2 fs-5"
                  style={{ textDecoration: "none" }}
                >
                  {customerName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Thông tin
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">
                    Đơn hàng của tôi
                  </Dropdown.Item>

                  {role === "ROLE_ADMIN" && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/admin">
                        <FiSettings className="me-2" />
                        Quản trị
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FiLogOut className="me-2" />
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-dark mx-2 fs-4">
                <FiUser />
              </Nav.Link>
            )}

            {/* Giỏ hàng */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="text-dark mx-2 fs-4 position-relative"
            >
              <FiShoppingCart />

              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    fontSize: "0.6rem",
                    padding: "2px 6px",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    lineHeight: "1",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
