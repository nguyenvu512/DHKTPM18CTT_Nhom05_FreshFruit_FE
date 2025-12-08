import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../style/LoginForm.css";
import axios from "axios";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/api/auth/forget-password", {
        username: email.trim(),
      });

      setMessage("Mã xác nhận đã được gửi về email của bạn");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy email");
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
              QUÊN MẬT KHẨU
            </h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label style={{ fontSize: "14px" }}>EMAIL</Form.Label>
                <Form.Label
                  style={{
                    fontSize: "14px",
                    color: "red",
                    marginLeft: "3px",
                  }}
                >
                  *
                </Form.Label>

                <Form.Control
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-100 rounded-0 custom-input"
                />
              </Form.Group>

              {error && (
                <div className="text-danger mb-3" style={{ fontSize: "13px" }}>
                  {error}
                </div>
              )}

              {message && (
                <div className="text-success mb-3" style={{ fontSize: "13px" }}>
                  {message}
                </div>
              )}

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
                {loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
              </Button>

              <p className="text-center mt-3" style={{ fontSize: "13px" }}>
                <a href="/login" style={{ textDecoration: "none" }}>
                  Quay lại đăng nhập
                </a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgetPasswordForm;
