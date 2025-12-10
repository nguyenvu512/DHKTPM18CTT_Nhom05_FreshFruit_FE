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

      window.location.href = "/";
    } catch (error) {
      const message =
        error.response?.data?.message || "Email hoặc mật khẩu không đúng";
      showToast(`❌ ${message}`);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5 bg-white">

      {/* Toast */}
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

      <Row className="w-100 d-flex justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <div className="login-box shadow-sm p-4 rounded bg-light">

            <h3 className="text-center mb-4 login-title">ĐĂNG NHẬP</h3>

            <Form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">EMAIL <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="custom-input"
                />
              </Form.Group>

              {/* PASSWORD */}
              <Form.Group className="mb-2">
                <Form.Label className="form-label-custom">MẬT KHẨU <span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="custom-input"
                />
              </Form.Group>

              <div className="mb-3 d-flex justify-content-end">
                <a href="/forget-password" className="link-small">
                  Quên mật khẩu?
                </a>
              </div>

              <Button type="submit" className="btn-login w-100">
                ĐĂNG NHẬP
              </Button>

              <p className="text-center mt-3 link-small">
                Not A Member?{" "}
                <a href="/register" className="fw-bold text-decoration-none">
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
