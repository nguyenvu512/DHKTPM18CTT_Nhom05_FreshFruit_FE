import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../style/Register.css";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/api/customer", formData);

      // ✅ Hiển thị thông báo thành công
      setSuccessMessage(
        "Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
      );

      // ✅ Sau 2s chuyển sang trang login
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Container className="d-flex justify-content-center align-items-center py-5 " style={{ minHeight: "90vh" }}>
    <Row className="w-100" style={{ maxWidth: "430px" }}>
      <Col>
        <div className="p-4 shadow rounded bg-white">
          <h3 className="text-center mb-4" style={{ fontWeight: "600", color: "#004D5B" }}>
            ĐĂNG KÝ
          </h3>

          {successMessage && (
            <Alert variant="success" className="py-2">{successMessage}</Alert>
          )}

          {errorMessage && (
            <Alert variant="danger" className="py-2">{errorMessage}</Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                className="rounded"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="address"
                className="rounded"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="phone"
                className="rounded"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                className="rounded"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                name="password"
                className="rounded"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100 p-2 rounded"
              disabled={loading}
              style={{ backgroundColor: "#004D5B", border: "none" }}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
            </Button>

            <p className="text-center mt-3">
              Đã có tài khoản?{" "}
              <a href="/login" style={{ textDecoration: "none" }}>
                Đăng nhập
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
