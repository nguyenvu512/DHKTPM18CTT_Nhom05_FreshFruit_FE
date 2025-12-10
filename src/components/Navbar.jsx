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
import { getAllProducts } from "../api/productApi";

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
  } catch {
    return null;
  }
};

function NavBar() {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const { cart } = useCart(); // 👉 LẤY GIỎ GLOBAL

  const [customerName, setCustomerName] = useState(null);
  const [role, setRole] = useState(null);

  // ----------------------
  // 🛒 Cart count — lấy từ CartContext (KHÔNG FETCH API)
  // ----------------------
  const cartCount = cart?.items?.length || 0;

  // ----------------------
  // 🔍 Search suggestion
  // ----------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Load token data
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      const payload = parseJwt(token);

      if (payload) {
        setCustomerName(payload.customerName || null);
        setRole(payload.scope || null);
      }
    }
  }, []);

  // Search suggestion fetch
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
        console.error("Search error:", err);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  // Click outside suggestion box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Select product from suggestion
  const handleSelectProduct = (product) => {
    setSearchTerm("");
    setSuggestions([]);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCustomerName(null);
    setRole(null);
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
          <div className="mx-auto w-50 position-relative" ref={wrapperRef}>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="me-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div
                className="bg-white border shadow-sm position-absolute w-100 mt-1 rounded"
                style={{ zIndex: 1050 }}
              >
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="d-flex align-items-center px-2 py-2"
                    onClick={() => handleSelectProduct(p)}
                    style={{ cursor: "pointer" }}
                  >
                    {p.images?.[0]?.url && (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 4,
                          marginRight: 10,
                        }}
                      />
                    )}
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right menu */}
          <Nav className="ms-auto fw-semibold">
            {/* User */}
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
                  <Dropdown.Item as={Link} to="my-order">
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

            {/* Cart */}
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
