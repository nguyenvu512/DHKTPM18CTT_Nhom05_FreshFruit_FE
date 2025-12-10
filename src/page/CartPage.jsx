import React, { useEffect } from "react";
import { Container, Row, Col, Card, Button, FormControl, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as cartApi from "../api/cartApi";
import "../style/Cart.css";
import { useCart } from "../context/CartContext";

// Quantity Selector Component
const QuantitySelector = ({ value, onChange }) => {
  return (
    <div className="d-flex align-items-center">
      <Button
        variant="outline-secondary"
        size="sm"
        className="px-2"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </Button>

      <FormControl
        type="number"
        value={value}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val > 0) onChange(val);
        }}
        className="text-center mx-1"
        style={{ width: "50px", padding: "0.25rem" }}
        min={1}
      />

      <Button
        variant="outline-secondary"
        size="sm"
        className="px-2"
        onClick={() => onChange(value + 1)}
      >
        +
      </Button>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();

  // 🟡 Lấy cart từ CartContext
  const { cart, fetchCart, customerId } = useCart();

  // Kiểm tra login
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !customerId) {
      navigate("/login");
    }
  }, [customerId]);

  // Cập nhật số lượng
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    await cartApi.updateCartItem({ customerId, productId, quantity });
    fetchCart(); // 🟢 cập nhật global cart
  };

  // Xóa item
  const removeItem = async (productId) => {
    await cartApi.removeCartItem(customerId, productId);
    fetchCart(); // 🟢 cập nhật global cart
  };

  // Clear cart
  const clearCart = async () => {
    await cartApi.clearCart(customerId);
    fetchCart(); // 🟢 cập nhật global cart
  };

  if (!cart) return <p className="text-center mt-4">Đang tải giỏ hàng…</p>;

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center fw-bold">Giỏ hàng của bạn</h2>

      {cart.items.length === 0 ? (
        <div className="text-center py-5">
          <h5>Giỏ hàng trống 😢</h5>
          <p>Hãy thêm sản phẩm yêu thích của bạn vào giỏ hàng!</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="d-none d-md-block">
            <table className="table align-middle cart-table shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <img
                        src={item.productImage || "https://via.placeholder.com/80"}
                        alt={item.productName}
                        style={{ width: "80px", objectFit: "contain" }}
                        className="me-2"
                      />
                      {item.productName}
                    </td>

                    <td className="text-success fw-bold">{item.price} đ</td>

                    <td>
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(val) => updateQuantity(item.productId, val)}
                      />
                    </td>

                    <td className="fw-bold">{item.total} đ</td>

                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="d-md-none">
            <Row className="g-3">
              {cart.items.map((item) => (
                <Col xs={12} key={item.productId}>
                  <Card className="shadow-sm hover-shadow p-2">
                    <Row className="align-items-center">
                      <Col xs={4}>
                        <div className="position-relative">
                          <img
                            src={item.productImage || "https://via.placeholder.com/80"}
                            alt={item.productName}
                            className="w-100"
                            style={{ objectFit: "contain" }}
                          />
                          <Badge
                            bg="danger"
                            pill
                            className="position-absolute top-0 start-100 translate-middle"
                          >
                            {item.quantity}
                          </Badge>
                        </div>
                      </Col>

                      <Col xs={8}>
                        <h6>{item.productName}</h6>

                        <p className="text-success fw-bold mb-1">
                          {item.price} đ
                        </p>

                        <QuantitySelector
                          value={item.quantity}
                          onChange={(val) => updateQuantity(item.productId, val)}
                        />

                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="fw-bold">{item.total} đ</span>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(item.productId)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Summary */}
          <div className="cart-summary mt-4 p-3 shadow-sm rounded bg-light d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-2 mb-md-0">
              <h5 className="fw-bold mb-1">
                Tổng tiền: <span className="text-success">{cart.totalPrice} đ</span>
              </h5>
              <small className="text-muted">
                Đã bao gồm VAT (nếu có)
              </small>
            </div>

            <div className="d-flex flex-column flex-md-row">
              <Button
                variant="danger"
                className="me-md-2 mb-2 mb-md-0"
                onClick={clearCart}
              >
                Xóa tất cả
              </Button>

              <Button
                variant="success"
                className="fw-bold"
                style={{ minWidth: "120px" }}
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
