import React from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import logo from "../img/logo.png"; 

function NavBar() {
  return (
    <Navbar bg="warning" expand="lg" className="py-2 shadow-sm">
      <Container>
        {/* Logo + Brand */}
        <Navbar.Brand
          href="#"
          className="fw-bold text-dark d-flex align-items-center"
        >
          <img
            src={logo}
            alt="MorningFruit logo"
            className="me-2"
            style={{
              height: "35px", 
              width: "auto",  
              objectFit: "contain", 
            }}
          />
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

          {/* Menu */}
          <Nav className="ms-auto fw-semibold">
            <Nav.Link href="#" className="text-dark mx-2">
              Trang chủ
            </Nav.Link>
            <Nav.Link href="#" className="text-dark mx-2">
              Trái cây Việt Nam
            </Nav.Link>
            <Nav.Link href="#" className="text-dark mx-2">
              Nhập khẩu
            </Nav.Link>
            <Nav.Link href="#" className="text-dark mx-2">
              Quà tặng
            </Nav.Link>
            <Nav.Link href="#" className="text-dark mx-2">
              Liên hệ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
