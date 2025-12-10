import React, { useState, useEffect, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingCart, FiLogOut, FiSettings } from "react-icons/fi";
import "../style/NavBar.css";
import { useCart } from "../context/CartContext";

// Decode JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
};

function NavBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [customerName, setCustomerName] = useState(null);
  const [role, setRole] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // 🟡 Lấy global cart từ CartContext
  const { cart } = useCart();

  // Tính tổng quantity trong cart
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Kiểm tra token khi NavBar load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const payload = parseJwt(token);
      if (payload?.customerName) {
        setCustomerName(payload.customerName);
      }
    }
  }, []);

  // Load cart quantity
  useEffect(() => {
    if (!customerId) return;

    const fetchCart = async () => {
      try {
        const res = await cartApi.getCart(customerId);

        if (!res || !res.items) {
          setCartCount(0);
          return;
        }

        const total = res.items.reduce((s, item) => s + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.error("Lỗi load cart:", err);
      }
    };

    fetchCart();
  }, [customerId]);

  // Fetch product suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await getAllProducts();
        const filtered = data.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCustomerName(null);
    setRole(null);
    setCustomerId(null);
    navigate("/");
  };

  // Select product from suggestion
  const handleSelectProduct = (product) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/product/${product.id}`, { state: { product } });
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
            <FormControl type="search" placeholder="Tìm kiếm sản phẩm..." className="me-2" />
          </Form>

          {/* Menu phải */}
          <Nav className="ms-auto fw-semibold">

            {/* User dropdown hoặc icon login */}
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
                  <Dropdown.Item as={Link} to="/profile">Thông tin</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">Đơn hàng của tôi</Dropdown.Item>

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

            {/* 🛒 ICON CART + BADGE */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="text-dark mx-2 position-relative fs-4"
            >
              <FiShoppingCart />

              <Badge
                bg="danger"
                pill
                className="position-absolute"
                style={{
                  fontSize: "0.65rem",
                  top: "6px",
                  right: "-9px",
                }}
              >
                {cartCount}
              </Badge>

            </Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
