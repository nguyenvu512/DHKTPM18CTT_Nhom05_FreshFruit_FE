import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "../style/LoginForm.css";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "danger",
  });

  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          username: email.trim(),
          password: password.trim(),
        },
        { withCredentials: true }
      );

      const { accessToken } = res.data.result;
      localStorage.setItem("accessToken", accessToken);

      // ✅ login success
      window.location.href = "/";
    } catch (error) {
      const message =
        error.response?.data?.message || "Email hoặc mật khẩu không đúng";

      showToast(`❌ ${message}`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-white">
      {/* ===== TOAST ===== */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toast.type}
          show={toast.show}
          delay={3000}
          autohide
          onClose={() => setToast({ ...toast, show: false })}
          className="fs-6 px-2 py-1"
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row>
        <Col>
          <div style={{ minWidth: "300px", margin: "0 auto" }}>
            <h2 className="text-center mb-4" style={{ fontSize: "20px" }}>
              ĐĂNG NHẬP
            </h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>EMAIL</Form.Label>
                <span style={{ color: "red" }}> *</span>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "14px" }}>MẬT KHẨU</Form.Label>
                <span style={{ color: "red" }}> *</span>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <div className="mb-3 d-flex justify-content-end">
                <a
                  href="/forget-password"
                  style={{ textDecoration: "none", fontSize: "13px" }}
                >
                  Quên Mật Khẩu?
                </a>
              </div>

              <Button
                type="submit"
                className="w-100 p-2"
                style={{
                  backgroundColor: "#004D5B",
                  border: "none",
                  fontSize: "14px",
                }}
              >
                ĐĂNG NHẬP
              </Button>

              <p className="text-center mt-3" style={{ fontSize: "13px" }}>
                Not A Member?{" "}
                <a href="/register" style={{ textDecoration: "none" }}>
                  Đăng Ký
                </a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
