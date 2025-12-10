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
import { FiUser, FiShoppingCart, FiLogOut } from "react-icons/fi";
import "../style/NavBar.css";
import { logOut } from "../api/authAPI";
import { getAllProducts } from "../api/productApi";

// Hàm decode JWT
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
  const [customerName, setCustomerName] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Lấy tên user từ token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = parseJwt(token);
      if (payload?.customerName) setCustomerName(payload.customerName);
    }
  }, []);
  

  // Lấy danh sách gợi ý khi searchTerm thay đổi
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const allProducts = await getAllProducts();
        const filtered = allProducts.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();
  }, [searchTerm]);

  // Click ngoài để ẩn gợi ý
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCustomerName(null);
    navigate("/");
  };

  // Khi chọn sản phẩm trong gợi ý
  const handleSelectProduct = (product) => {
    setSearchTerm("");
    setSuggestions([]);
    // navigate và truyền object product sang DetailPage
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
          <div
            className="mx-auto my-2 my-lg-0 w-50 position-relative"
            ref={wrapperRef}
          >
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="me-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form>

            {suggestions.length > 0 && (
              <div className="search-suggestions bg-white border shadow-sm position-absolute w-100 mt-1">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="d-flex align-items-center px-2 py-1 suggestion-item"
                    onClick={() => handleSelectProduct(product)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.images?.[0]?.url && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      />
                    )}
                    <span className="text-truncate">{product.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User & Cart */}
          <Nav className="ms-auto fw-semibold">
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
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FiLogOut className="me-2" /> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-dark mx-2 fs-4">
                <FiUser />
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/cart" className="text-dark mx-2 fs-4">
              <FiShoppingCart />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
