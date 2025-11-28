import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../style/LoginForm.css";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/customer",
        formData
      );
      console.log("Registration success:", res.data);
      // Điều hướng về login
      window.location.href = "/login";
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <Row>
        <Col>
          <div style={{ minWidth: "300px", margin: "0 auto" }}>
            <h2 className="text-center mb-4" style={{ fontSize: "20px" }}>
              ĐĂNG KÝ
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>HỌ VÀ TÊN</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>ĐỊA CHỈ</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>
                  SỐ ĐIỆN THOẠI
                </Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>EMAIL</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>MẬT KHẨU</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 p-2"
                style={{
                  backgroundColor: "#004D5B",
                  border: "none",
                  fontSize: "14px",
                }}
              >
                ĐĂNG KÝ
              </Button>

              <p className="text-center mt-3" style={{ fontSize: "13px" }}>
                Already a member?{" "}
                <a href="/login" style={{ textDecoration: "none" }}>
                  Đăng Nhập
                </a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
