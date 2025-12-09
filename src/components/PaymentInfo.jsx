import React, { useEffect, useState } from "react";
import "../style/PaymentInfo.css"
import MoneyFormat from "../utils/MoneyFormat";
import { toast, ToastContainer } from "react-toastify";
import * as orderApi from "../api/orderApi";
import {parseJwt} from "../utils/Common"

const PaymentInfo = ({
  orderedProducts,
  addressInfo,
  paymentMethod,
  voucherInfo,
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [showMessageSuccess, setShowMessageSuccess] = useState(false);
    const [showMessageFail, setShowMessageFail] = useState(false);
    const [messageFail, setMessageFail] = useState("");

    // Phí vận chuyển
    const [shippingMoney, setShippingMoney] = useState(20000);
    // Tiền khuyến mãi
    const [voucherMoney, setVoucherMoney] = useState();
    // Tổng tiền
    const [totalMoney, setTotalMoney] = useState(0);

    console.log(orderedProducts)
    const totalPrice = orderedProducts.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      );

    useEffect(() => {
        let newVoucherMoney = 0;
    
        if(voucherInfo)
            newVoucherMoney = (voucherInfo?.discount * totalPrice) / 100; // Giảm theo phần trăm
    
        setVoucherMoney(newVoucherMoney);
    
        // Tính tổng tiền
        const newTotalMoney = (totalPrice + shippingMoney) - newVoucherMoney;
        setTotalMoney(newTotalMoney);
    }, [voucherInfo, totalPrice]);
      
    // function handle payment click
    const handlePayment = async () => {

        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.warning("Vui lòng đăng nhập để mua hàng.", { position: "top-right" });
            return;
        }
        
        const customerId = parseJwt(token)?.customerID;

        if (!customerId) {
            toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.", { position: "top-right" });
            return;
        }

        const orderData = {
            orderDate: new Date().toISOString(),
            paymentMethod: paymentMethod,
            totalAmount: totalMoney,
            shippingAddress: `${addressInfo?.address}, ${addressInfo?.commune}, ${addressInfo?.province}`,
            customerId,
            voucherId: voucherInfo ? voucherInfo.id : "",
            items: orderedProducts.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            fullName: addressInfo?.fullName,
            phoneNumber: addressInfo?.phoneNumber,
        };

        // check payment information
        if (!orderData.fullName) {
          toast.error("Họ tên người nhận không được để trống" ,{ position: "top-right" });
          return;
        }

        if (!orderData.phoneNumber) {
          toast.error("SĐT người nhận không được để trống");
          return;
        }

        if (
          !addressInfo.province ||
          addressInfo.province === "Chọn Tỉnh/Thành Phố"
        ) {
          toast.error("Tỉnh/Thành Phố không được để trống");
          return;
        }
       
        if (!addressInfo.commune || addressInfo.commune === "Chọn Phường/Xã") {
          toast.error("Phường/Xã không được để trống");
          return;
        }

        if (!addressInfo.address) {
          toast.error("Địa chỉ nhận hàng không được để trống");
          return;
        }

        if (!orderData.paymentMethod) {
          toast.error("Phương thức thanh toán không được để trống");
          return;
        }
    
        setIsLoading(true); // Hiển thị spinner trong khi đợi API phản hồi
    
        try {
            const response = await orderApi.createOrder(orderData);

            if(response.data.result?.paymentUrl) {
                window.location.href = response.data.result.paymentUrl;
            } else {
                setIsLoading(false);
                setShowMessageSuccess(true);
            }

        } catch (err) {
            setIsLoading(false)
            setMessageFail(response.message)
            setShowMessageFail(true);
            console.error(err);
        }
        
    }

    const closeSuccessMessage = () => {
        window.location.href = "/";
      };
      const closeFailMessage = () => {
        setIsLoading(false);
        setShowMessageFail(false);
      };

    return (
        <div
            className="container p-3 mb-2"
            style={{ backgroundColor: "white", borderRadius: 10 }}
        >
        <h4
            className="text-muted"
            style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
        >
            THÔNG TIN THANH TOÁN
        </h4>
        <hr />
        {/* Thông tin tổng tiền */}
        <div style={{ width: "100%", textAlign: "right", color: "black" }}>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 150px",
                    alignItems: "center",
                    marginBottom: "5px",
                }}
                >
                <span style={{fontWeight: 500, }}>Thành tiền:</span>
                <span style={{fontWeight: 500, fontSize: "18px"}}>{MoneyFormat(totalPrice)}</span>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 150px",
                    alignItems: "center",
                    marginBottom: "5px",
                }}
            >
                <span style={{fontWeight: 500}}>Phí vận chuyển:</span>
                <span style={{fontWeight: 500, fontSize: "18px"}}>{MoneyFormat(shippingMoney)}</span>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 150px",
                    alignItems: "center",
                    marginBottom: "5px",
                }}
            >
                <span style={{fontWeight: 500}}>
                    Khuyến mãi {voucherInfo ? `(${voucherInfo.name})` : ""}:
                </span>
                <span style={{fontWeight: 500, fontSize: "18px"}}>{MoneyFormat(voucherMoney)}</span>
            </div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "auto 150px",
                    alignItems: "center",
                    marginBottom: "5px",
                }}
            >
                <strong style={{ fontSize: "1.3rem" }}>Tổng tiền:</strong>
                <strong style={{ fontSize: "1.3rem" }}>
                    {MoneyFormat(totalMoney)}
                </strong>
            </div>
        </div>

        {/* Đường kẻ ngang */}
        <hr />

        {/* Nút thanh toán */}
        <div style={{ width: "100%", textAlign: "right" }}>
            <button
                className="btn-payment-dark"
                style={{
                    backgroundColor: "#ffc107",
                    padding: "10px 65px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                }}
                onClick={handlePayment}
            >
                {paymentMethod === "VN_PAY"
                    ? "XÁC NHẬN THANH TOÁN"
                    : "XÁC NHẬN ĐẶT HÀNG"}
                </button>
        </div>

        {/* spiner */}
        {isLoading && (
            <div className="order-overlay">
                <div className="order-spinner"></div>
            </div>
        )}

        {/* Thông báo thành công */}
        {showMessageSuccess && (
            <>
            <div className="overlay"></div> {/* Overlay dưới thông báo */}
            <div className="success-message">
                <button className="close-btn"
                 onClick={closeSuccessMessage}
                 >
                &times;
                </button>
                <div className="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="green"
                    viewBox="0 0 24 24"
                    width="110px"
                    height="110px" // Tăng kích thước icon
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"
                    fill="green"
                    />
                </svg>
                </div>
                <p>ĐẶT HÀNG THÀNH CÔNG!</p>
            </div>
            </>
        )}

        {/* Thông báo thất bại */}
        {showMessageFail && (
            <>
            <div className="order-overlay"></div> {/* Overlay dưới thông báo */}
            <div className="failure-message">
                <button className="close-btn"
                 onClick={closeFailMessage}
                >
                &times;
                </button>
                <div className="icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="red"
                    viewBox="0 0 24 24"
                    width="100px"
                    height="100px" // Tăng kích thước icon
                >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.59 6.41L13.41 12l4.18 4.18-1.41 1.41L12 13.41l-4.18 4.18-1.41-1.41L10.59 12 6.41 7.82 7.82 6.41 12 10.59l4.18-4.18 1.41 1.41z"
                    fill="red" // Màu đỏ báo lỗi
                    />
                </svg>
                </div>
                <p>{messageFail}</p>
            </div>
            </>
        )}
        
        <ToastContainer />
        </div>
    );
};
export default PaymentInfo;