import React from "react";
import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import "../style/NavBar.css";

function NavBar() {
  return (
    <Navbar bg="warning" expand="lg" className="py-2 shadow-sm">
      <Container>
        {/* Brand chỉ chữ */}
        <Navbar.Brand as={Link} to="/" className="brand-text fw-bold">
          FreshFruits
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Ô tìm kiếm */}
          <Form className="d-flex mx-auto my-2 my-lg-0 w-50">
            <FormControl
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
            />
          </Form>

          {/* Menu với icon */}
          <Nav className="ms-auto fw-semibold">
            <Nav.Link as={Link} to="/login" className="text-dark mx-2 fs-4">
              <FiUser />
            </Nav.Link>
            <Nav.Link as={Link} to="#" className="text-dark mx-2 fs-4">
              <FiShoppingCart />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
