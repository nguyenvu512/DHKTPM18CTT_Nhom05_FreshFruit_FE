import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../style/LoginForm.css";
import axios from "axios";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <Row>
        <Col>
          <div style={{ minWidth: "300px", margin: "0 auto" }}>
            <h2 className="text-center mb-4" style={{ fontSize: "20px" }}>
              ĐĂNG NHẬP
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={{ fontSize: "14px" }}>EMAIL</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label style={{ fontSize: "14px" }}>MẬT KHẨU</Form.Label>
                <Form.Label
                  style={{ fontSize: "14px", color: "red", marginLeft: "3px" }}
                >
                  *
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              <Form.Group
                className="mb-3 d-flex justify-content-end align-items-center"
                controlId="formBasicCheckbox"
              >
                <a
                  href="#"
                  style={{ textDecoration: "none", fontSize: "13px" }}
                >
                  Quên Mật Khẩu?
                </a>
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
                ĐĂNG NHẬP
              </Button>

              <p className="text-center mt-3" style={{ fontSize: "13px" }}>
                Not A Member?{" "}
                <a href="#" style={{ textDecoration: "none" }}>
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
