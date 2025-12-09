import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Spinner,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { getInfo, updateProfile } from "../api/customerAPI";
import { parseJwt } from "../utils/jwt";
import "../style/LoginForm.css";

// ================= REGEX =================
const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
const phoneRegex = /^[0-9\s]+$/;
const addressRegex = /^[A-Za-zÀ-ỹ0-9\s,./-]+$/;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const payload = parseJwt(token);
        const userId = payload?.customerID;
        if (!userId) return;

        const data = await getInfo(userId);
        setProfile(data);
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.log(err);

        showToast("❌ Không thể tải thông tin", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= TOAST =================
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // ================= VALIDATE (CHỈ KHI SAVE) =================
  const validateForm = () => {
    if (!form.name.trim()) {
      showToast("❌ Họ và tên không được để trống", "danger");
      return false;
    }

    if (!nameRegex.test(form.name.trim())) {
      showToast("❌ Họ và tên chỉ được chứa chữ cái", "danger");
      return false;
    }

    if (!form.phone.trim()) {
      showToast("❌ Số điện thoại không được để trống", "danger");
      return false;
    }

    if (!phoneRegex.test(form.phone.trim())) {
      showToast("❌ Số điện thoại chỉ được chứa số", "danger");
      return false;
    }

    if (!form.address.trim()) {
      showToast("❌ Địa chỉ không được để trống", "danger");
      return false;
    }

    if (!addressRegex.test(form.address.trim())) {
      showToast("❌ Địa chỉ không hợp lệ", "danger");
      return false;
    }

    return true;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const updated = await updateProfile(profile.id, form);
      setProfile(updated);
      showToast("✅ Cập nhật thông tin thành công");
    } catch (err) {
      console.log(err);

      showToast("❌ Cập nhật thất bại", "danger");
    } finally {
      setSaving(false);
    }
  };

  // ================= CANCEL =================
  const handleCancel = () => {
    setForm({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    });
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <Container fluid className="vh-100 d-flex align-items-center bg-light">
      {/* ========= TOAST ========= */}
      <ToastContainer position="top-end" className="p-4">
        <Toast
          bg={toast.type}
          show={toast.show}
          delay={3000}
          autohide
          onClose={() => setToast({ ...toast, show: false })}
          className="fs-6 px-2 py-1 shadow-sm"
        >
          <Toast.Body className="text-white fw-medium">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="w-100 justify-content-center">
        <Col xl={6} lg={7} md={9}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <h3 className="text-center mb-4 fw-bold">THÔNG TIN CÁ NHÂN</h3>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ID</Form.Label>
                      <Form.Control disabled value={profile.id} />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control disabled value={profile.email} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-3">
                  <Button
                    variant="outline-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Hủy
                  </Button>

                  <Button
                    disabled={saving}
                    onClick={handleSave}
                    style={{
                      backgroundColor: "#004D5B",
                      border: "none",
                    }}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
