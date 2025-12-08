import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
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
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <Row>
        <Col>
          <div style={{ minWidth: "300px", margin: "0 auto" }}>
            <h2 className="text-center mb-4" style={{ fontSize: "20px" }}>
              ĐĂNG KÝ
            </h2>

            {successMessage && (
              <Alert
                variant="success"
                className="py-2"
                style={{ fontSize: "13px" }}
              >
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert
                variant="danger"
                className="py-2"
                style={{ fontSize: "13px" }}
              >
                {errorMessage}
              </Alert>
            )}

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
                disabled={loading}
                style={{
                  backgroundColor: "#004D5B",
                  border: "none",
                  fontSize: "14px",
                }}
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
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
