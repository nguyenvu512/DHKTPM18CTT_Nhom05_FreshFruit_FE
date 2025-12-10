import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Row, Col, ListGroup, Card, Form, InputGroup } from "react-bootstrap";
import { getAllOrder, getMyOrders, updateStatusOrder } from "../api/orderApi";
import { getProductById } from "../api/productApi";
import { getVoucherById } from "../api/voucherApi";
import MoneyFormat from "../utils/MoneyFormat";
import { parseJwt } from "../utils/Common";
import "../style/PaymentInfo.css"; 

const SHIPPING_FEE = 20000;

const STATUS_FLOW = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "FAILED"];

const calculateSubtotal = (products) => {
  return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // --- MỚI: State cho Filter ---
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");

  // State Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    products: [],
    voucher: null,
    calculatedTotal: 0,
  });
  const [loadingDetails, setLoadingDetails] = useState(false);

  // State Form Update
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  const statusMap = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao thành công",
    FAILED: "Đã hủy"
  };

  const statusColorMap = {
    PENDING: "bg-secondary",
    CONFIRMED: "bg-info",
    SHIPPING: "bg-primary",
    DELIVERED: "bg-success",
    FAILED: "bg-danger"
  };

  const token = localStorage.getItem("accessToken");
  const username = parseJwt(token)?.sub;

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus("");
      setNote("");
    }
  }, [selectedOrder]);

  const loadOrders = async () => {
    try {
      const response = await getMyOrders();
      if (response.code === 1000) {
        const sorted = response.result.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sorted);
        return sorted; 
      } else {
        setError(new Error(response.message || "Lỗi tải dữ liệu"));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // --- MỚI: Logic Filter đơn hàng ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        // 1. Lọc theo trạng thái
        const matchStatus = filterStatus === "ALL" || order.status === filterStatus;

        // 2. Lọc theo ngày (So sánh chuỗi YYYY-MM-DD)
        let matchDate = true;
        if (filterDate) {
            const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0]; // Lấy YYYY-MM-DD
            matchDate = orderDateStr === filterDate;
        }

        return matchStatus && matchDate;
    });
  }, [orders, filterStatus, filterDate]);

  const handleRowClick = async (order) => {
    setSelectedOrder(order);
    setShowModal(true);
    setLoadingDetails(true);
    
    try {
      const productDetailsPromises = order.items.map(async (item) => {
        try {
            const product = await getProductById(item.productId);
            return { ...product, quantity: item.quantity, price: product.price || 0 };
        } catch {
            return { id: item.productId, name: "Sản phẩm lỗi", price: 0, quantity: item.quantity };
        }
      });
      const products = await Promise.all(productDetailsPromises);
      
      let voucher = null;
      if (order.voucherId) {
          try { voucher = await getVoucherById(order.voucherId); } catch {}
      }

      const subtotal = calculateSubtotal(products);
      const discountRate = voucher?.discount / 100 || 0;
      const finalTotal = subtotal - (subtotal * discountRate) + SHIPPING_FEE;

      setOrderDetails({ products, voucher, calculatedTotal: finalTotal });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;


  return (
    <div className="container mt-4">
      {/* LOADING OVERLAY */}
      {isProcessing && (
        <div className="order-overlay">
            <div className="order-spinner"></div>
        </div>
      )}

      <h2 className="mb-4 text-center">Quản Lý Đơn Hàng</h2>

      {/* --- MỚI: THANH FILTER --- */}
      <Card className="mb-4 shadow-sm bg-light">
        <Card.Body className="py-3">
            <Row className="align-items-end">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="fw-bold">Lọc theo trạng thái:</Form.Label>
                        <Form.Select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            {Object.keys(statusMap).map(key => (
                                <option key={key} value={key}>{statusMap[key]}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label className="fw-bold">Lọc theo ngày đặt:</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={filterDate} 
                            onChange={(e) => setFilterDate(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Button 
                        variant="outline-secondary" 
                        className="w-100"
                        onClick={() => { setFilterStatus("ALL"); setFilterDate(""); }}
                    >
                        Xóa bộ lọc
                    </Button>
                </Col>
            </Row>
        </Card.Body>
      </Card>
      
      <table className="table table-bordered table-hover shadow-sm">
        <thead className="table-dark">
            <tr>
                <th>Khách hàng</th>
                <th>SĐT</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
            </tr>
        </thead>
        <tbody>
            {/* SỬ DỤNG filteredOrders THAY VÌ orders */}
            {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                    <tr key={order.id} onClick={() => handleRowClick(order)} style={{cursor: 'pointer'}}>
                        <td>{order.fullName}</td>
                        <td>{order.phoneNumber}</td>
                        <td>{new Date(order.orderDate).toLocaleString('vi-VN')}</td>
                        <td>
                            <span className={`badge ${statusColorMap[order.status]}`}>
                                {statusMap[order.status] || order.status}
                            </span>
                        </td>
                        <td className="text-end fw-bold">{MoneyFormat(order.totalAmount)}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="5" className="text-center py-4">Không tìm thấy đơn hàng phù hợp</td>
                </tr>
            )}
        </tbody>
      </table>

      {/* MODAL CHI TIẾT */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn hàng #{selectedOrder.id.substring(0,8)}...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loadingDetails ? (
                    <p className="text-center">Đang tải chi tiết...</p>
                ) : (
                    <Row>
                        <Col md={5}>
                            {/* CARD INFO: FULL THÔNG TIN */}
                            <Card className="mb-3 shadow-sm">
                                <Card.Header style={{ backgroundColor: '#ffc107', color: '#000', fontWeight: 'bold' }}>
                                    Thông tin đơn hàng
                                </Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Khách hàng:</strong> {selectedOrder.fullName}</ListGroup.Item>
                                    <ListGroup.Item><strong>SĐT:</strong> {selectedOrder.phoneNumber}</ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Ngày đặt: </strong> 
                                        {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}
                                    </ListGroup.Item>
                                    
                                    {/* --- MỚI: HIỂN THỊ NGÀY GIAO HÀNG NẾU DELIVERED --- */}
                                    {selectedOrder.status === "DELIVERED" && selectedOrder.shippingDate && (
                                        <ListGroup.Item className="bg-success bg-opacity-10">
                                            <strong className="text-success">Ngày giao thành công: </strong> <br/>
                                            {new Date(selectedOrder.shippingDate).toLocaleString('vi-VN')}
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <strong>Địa chỉ: </strong> 
                                        {selectedOrder.shippingAddress}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Thanh toán: </strong> 
                                        <span className="text-primary fw-bold">
                                            {selectedOrder.paymentMethod === "VN_PAY" ? "VN PAY" : "Thanh toán khi nhận hàng"}
                                        </span>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Trạng thái: </strong> 
                                        <span className={`badge fs-6 mt-1 ms-2 ${statusColorMap[selectedOrder.status]}`}>
                                            {statusMap[selectedOrder.status]}
                                        </span>
                                    </ListGroup.Item>

                                    {/* HIỂN THỊ LÝ DO HỦY NẾU FAILED */}
                                    {selectedOrder.status === "FAILED" && (
                                        <ListGroup.Item className="bg-danger bg-opacity-10">
                                            <strong className="text-danger">Lý do hủy/thất bại: </strong> 
                                            <p className="mb-0 mt-1 fst-italic">
                                                "{selectedOrder.description || "Không có lý do cụ thể"}"
                                            </p>
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card>
                            
                        </Col>

                        <Col md={7}>
                            <h5 className="mb-3 text-primary">Danh sách sản phẩm ({orderDetails.products.length})</h5>
                             <div className="list-group overflow-auto border rounded mb-3" style={{ maxHeight: "500px" }}>
                                {orderDetails.products.map((item) => (
                                  <div key={item.id} className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                      {item.images?.[0] && (
                                        <img src={item.images[0].url} alt="" width="60" className="me-3 rounded border" />
                                      )}
                                      <div>
                                        <div className="fw-bold">{item.name}</div>
                                        <small>{MoneyFormat(item.price)} x {item.quantity}</small>
                                      </div>
                                    </div>
                                    <div className="fw-bold">{MoneyFormat(item.price * item.quantity)}</div>
                                  </div>
                                ))}
                             </div>
                             
                             <Card className="bg-light">
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tạm tính:</span>
                                        <span>{MoneyFormat(calculateSubtotal(orderDetails.products))}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Phí ship:</span>
                                        <span>{MoneyFormat(SHIPPING_FEE)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Voucher:</span>
                                        <span>-{MoneyFormat(calculateSubtotal(orderDetails.products) * (orderDetails.voucher?.discount / 100 || 0))}</span>
                                    </div>
                                    <hr/>
                                    <div className="d-flex justify-content-between fs-4 fw-bold text-primary">
                                        <span>Tổng cộng:</span>
                                        <span>{MoneyFormat(selectedOrder.totalAmount)}</span>
                                    </div>
                                </Card.Body>
                             </Card>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default MyOrder;