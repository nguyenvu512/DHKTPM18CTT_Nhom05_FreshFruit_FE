import React, { useState } from "react";

const PaymentMethods = ({ setPaymentMethod }) => {
  const [selectedMethod, setSelectedMethod] = useState("creditCard");

  const paymentMethods = [
    {
      id: "VN_PAY",
      name: "Thanh toán với VN PAY",
      imgSrc:
        "https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_vnpay.svg?q=10707", 
    },
    {
      id: "DIRECT_PAYMENT",
      name: "Thanh toán khi nhận hàng",
      imgSrc:
        "https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_cashondelivery.svg?q=10707",
    },
  ];

  const handleChange = (e) => {
    setSelectedMethod(e.target.value);
    setPaymentMethod(e.target.value);
  };

  return (
    <div
      className="container p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        PHƯƠNG THỨC THANH TOÁN
      </h4>
      <hr />
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {paymentMethods.map((method) => (
          <li key={method.id} className="d-flex align-items-center mb-3">
            <input
              type="radio"
              id={method.id}
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={handleChange}
              className="me-3"
              style={{ width: 20, height: 20 }}
            />
            <div style={{ width: "40px" }}>
              <img
                src={method.imgSrc}
                alt={method.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="ms-3">{method.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethods;