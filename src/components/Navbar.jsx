import React, { useState, useEffect, useRef } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingCart, FiLogOut, FiSettings } from "react-icons/fi";
import "../style/NavBar.css";

import * as cartApi from "../api/cartApi";
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

  const [customerName, setCustomerName] = useState(null);
  const [role, setRole] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Load user info from token
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

        <Navbar.Toggle />
        <Navbar.Collapse>
          {/* SEARCH BOX */}
          <div className="mx-auto w-50 position-relative" ref={wrapperRef}>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>

            {/* SUGGESTIONS */}
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

          {/* USER & CART */}
          <Nav className="ms-auto fw-semibold">
            {/* USER */}
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

                  <Dropdown.Item as={Link} to="/my-order">
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

            {/* CART */}
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
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                    borderRadius: "50%",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
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
