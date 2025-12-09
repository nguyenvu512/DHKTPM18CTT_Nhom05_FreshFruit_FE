import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllOrder, getMyOrders } from "../api/orderApi";
import { getProductById } from "../api/productApi";
import { getVoucherById } from "../api/voucherApi";
import { Modal, Button, Row, Col, ListGroup, Card } from "react-bootstrap";
import MoneyFormat from "../utils/MoneyFormat";

// Định nghĩa Phí giao hàng cố định
const SHIPPING_FEE = 20000;

// Hàm tính toán tổng tiền hàng (Subtotal)
const calculateSubtotal = (products) => {
  return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const [orderDetails, setOrderDetails] = useState({
    products: [],
    voucher: null,
    calculatedTotal: 0,
  });
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getAllOrder();
      if (response.code === 1000) {
        setOrders(response.result);
      } else {
        setError(
          new Error(response.message || "Không tải được dữ liệu đơn hàng")
        );
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setLoadingDetails(true);

    try {
      // Lấy chi tiết sản phẩm
      const productDetailsPromises = order.items.map(async (item) => {
        try {
          const product = await getProductById(item.productId);
          return {
            ...product,
            quantity: item.quantity,
            price: product.price || 0,
          };
        } catch (err) {
          console.error(`Lỗi khi tải sản phẩm ID ${item.productId}:`, err);
          return {
            id: item.productId,
            name: "Lỗi tải sản phẩm",
            price: 0,
            quantity: item.quantity,
            images: [],
          };
        }
      });
      const products = await Promise.all(productDetailsPromises); 
      // Lấy chi tiết voucher nếu có
      let voucher = null;
      if (order.voucherId) {
        try {
          voucher = await getVoucherById(order.voucherId);
        } catch (err) {
          console.error(`Lỗi khi tải voucher ID ${order.voucherId}:`, err);
        }
      }

      // Tính toán Subtotal và Final Total (cho mục đích hiển thị tổng kết)
      const subtotal = calculateSubtotal(products);
      const discountRate = voucher?.discount / 100 || 0;
      const discountAmount = subtotal * discountRate;
      const finalTotal = subtotal - discountAmount + SHIPPING_FEE;

      setOrderDetails({ products, voucher, calculatedTotal: finalTotal });
    } catch (err) {
      console.error("Lỗi khi tải chi tiết đơn hàng (lỗi chung):", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setOrderDetails({ products: [], voucher: null, calculatedTotal: 0 });
  };

  if (loading) return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
  if (error)
    return (
      <p className="text-center mt-4 text-danger">
        Lỗi khi tải dữ liệu: {error.message}
      </p>
    );

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Đơn hàng của tôi</h3>
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Ngày đặt</th>
            <th>Phương thức thanh toán</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => handleRowClick(order)}
                style={{ cursor: "pointer" }}
              >
                <td>{order.fullName}</td>
                <td>{order.phoneNumber}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  {order.paymentMethod === "VN_PAY"
                    ? "Thanh toán bằng VN PAY"
                    : "Thanh toán khi nhận hàng"}
                </td>
                <td>
                  {order.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : order.status === "PENDING"
                    ? "Đang xử lý"
                    : order.status}
                </td>
                <td>{MoneyFormat(order.totalAmount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chi tiết đơn hàng (Đã Cải Tiến) */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose} size="xl">
          <Modal.Header className="bg-light">
            <Modal.Title className="text-primary">
              Chi tiết đơn hàng #{selectedOrder.id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetails ? (
              <p className="text-center py-5">Đang tải chi tiết đơn hàng...</p>
            ) : (
              <Row>
                {/* Cột 1: Thông tin giao hàng & Thanh toán */}
                <Col md={4} className="border-end">
                  <Card className="shadow-sm mb-3">
                    <Card.Header className="bg-warning text-dark">
                      **Thông tin giao nhận**
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Mã đơn:</strong> {selectedOrder.id}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Người nhận:</strong> {selectedOrder.fullName}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>SĐT:</strong> {selectedOrder.phoneNumber}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Ngày đặt:</strong>{" "}
                        {new Date(selectedOrder.orderDate).toLocaleString()}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Địa chỉ:</strong>{" "}
                        {selectedOrder.shippingAddress}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>

                  <Card className="shadow-sm">
                    <Card.Header className="bg-warning text-dark">
                      **Thanh toán & Trạng thái**
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Thanh toán:</strong>{" "}
                        {selectedOrder.paymentMethod === "VN_PAY"
                          ? "Thanh toán bằng VN PAY"
                          : "Thanh toán khi nhận hàng"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Voucher:</strong>{" "}
                        {orderDetails.voucher
                          ? `${orderDetails.voucher.name} (${orderDetails.voucher.discount}%)`
                          : "Không có"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Trạng thái:</strong>{" "}
                        <span
                          className={`badge ${
                            selectedOrder.status === "COMPLETED"
                              ? "bg-success"
                              : selectedOrder.status === "PENDING"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {selectedOrder.status === "COMPLETED"
                            ? "Đã hoàn thành"
                            : selectedOrder.status === "PENDING"
                            ? "Đang xử lý"
                            : selectedOrder.status}
                        </span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>

                {/* Cột 2: Danh sách Sản phẩm & Tổng kết tiền */}
                <Col md={8}>
                  <h5 className="mb-3 text-primary">
                    Sản phẩm đã đặt ({orderDetails.products.length})
                  </h5>
                  <div
                    className="list-group overflow-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    {orderDetails.products.map((item) => (
                      <ListGroup.Item
                        key={item.id}
                        className="d-flex align-items-center justify-content-between mb-2 p-3 border rounded"
                      >
                        <div className="d-flex align-items-center">
                          {item.images && item.images[0] && (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              width="80"
                              className="me-3 rounded shadow-sm"
                            />
                          )}
                          <div>
                            <strong className="d-block">{item.name}</strong>
                            <small className="text-muted">
                              Giá: {MoneyFormat(item.price)} x {item.quantity}
                            </small>
                          </div>
                        </div>
                        <div className="text-end">
                          <span className="text-muted d-block">
                            Thành tiền:
                          </span>
                          <strong className="text-success">
                            {MoneyFormat(item.price * item.quantity)}
                          </strong>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </div>

                  {/* Tổng kết tiền */}
                  <Card className="mt-4 bg-light shadow-sm">
                    <Card.Body>
                      <h5 className="card-title text-dark">
                        Tổng kết đơn hàng
                      </h5>
                      <hr />
                      <Row className="mb-2">
                        <Col>Tổng tiền hàng:</Col>
                        <Col className="text-end">
                          {MoneyFormat(
                            calculateSubtotal(orderDetails.products)
                          )}
                        </Col>
                      </Row>
                      <Row className="mb-2">
                        <Col>Phí giao hàng:</Col>
                        <Col className="text-end">
                          {MoneyFormat(SHIPPING_FEE)}
                        </Col>
                      </Row>
                      <Row className="mb-2 text-success">
                        <Col>
                          Chiết khấu Voucher (
                          {orderDetails.voucher?.discount || 0}%):
                        </Col>
                        <Col className="text-end">
                          {MoneyFormat(
                            calculateSubtotal(orderDetails.products) *
                              (orderDetails.voucher?.discount / 100 || 0)
                          )}
                        </Col>
                      </Row>
                      <Row className="mt-3 border-top pt-2">
                        <Col>
                          <strong>Tổng thanh toán:</strong>
                        </Col>
                        <Col className="text-end">
                          <h4 className="text-primary">
                            {MoneyFormat(selectedOrder.totalAmount)}
                          </h4>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Orders;