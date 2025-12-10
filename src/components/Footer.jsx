import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <>
      

      <footer
        className="bg-warning text-dark pt-5 pb-3 "
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <Container>
          <Row className="gy-4">

            {/* Cột 1 - Thông tin cửa hàng */}
            <Col md={4}>
              <h5 className="fw-bold mb-3">Về FreshFruit</h5>
              <p>Morning Fruit là thương hiệu trái cây tươi chất lượng cao, với đa dạng sản phẩm phục vụ mọi nhu cầu: đặc sản vùng miền, trái cây nhập khẩu, quà tặng trái cây, mâm ngũ quả,...</p>
              
            </Col>

            {/* Cột 2 - Hỗ trợ khách hàng */}
            <Col md={4}>
              <h5 className="fw-bold mb-3">Địa chỉ mua hàng</h5>

              <p className="small mb-2">
                FreshFruit – Trái cây sạch, an toàn, chất lượng cao mỗi ngày.
              </p>

              <p className="small mb-1">
                Chi nhánh 1: 183 Nguyễn Thái Học, P. Bến Thành, TP.HCM
              </p>
              <p className="small mb-1">
                Chi nhánh 2: 42B Trần Huy Liệu, P. Phú Nhuận
              </p>

              <p className="small mb-1 fw-semibold mt-2">
                Điện thoại: <span className="fw-bold">0865 660 775</span>
              </p>
              <p className="small mb-1">
                Email: hello@freshfruit.com
              </p>
            </Col>

            {/* Cột 3 - Chăm sóc khách hàng + MXH */}
            <Col md={4}>
              <h5 className="fw-bold mb-3">Chăm sóc khách hàng</h5>

              <p className="small fw-semibold mb-1">
                Hotline: <span className="fw-bold">0865 660 775</span>
              </p>

              <p className="small mb-3">email@freshfruit.com.vn</p>

              
              <div className="d-flex gap-3 fs-4">
                <a href="#" className="text-dark">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-dark">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-dark">
                  <i className="bi bi-tiktok"></i>
                </a>
                <a href="#" className="text-dark">
                  <i className="bi bi-telephone-outbound"></i>
                </a>
              </div>
            </Col>

          </Row>

          {/* Dòng bản quyền */}
          <div className="text-center pt-3 mt-4 small fw-semibold">
            © 2025 FreshFruit – Trái Cây Sạch, Chất Lượng Cao
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Footer;
