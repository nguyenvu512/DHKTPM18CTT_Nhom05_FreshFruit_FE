import React, { useEffect, useState } from "react";
import * as voucherApi from "../api/voucherApi";

const Voucher = ({ setVoucher }) => {
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const data = await voucherApi.getAllVouchers();
        setVouchers(data);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleVoucherChange = (e) => {
    console.log("Event:", e.target); // ← Debug xem có phải input không
    console.log("Value:", e.target.value); // ← Debug value
    console.log("Type:", typeof e.target.value); // ← Debug kiểu
    
    const selectedId = e.target.value;
    setSelectedVoucher(selectedId);
  
    const chooseVoucher = vouchers.find(
      (voucher) => voucher.id === selectedId
    );
  
    setVoucher(chooseVoucher);
  };

  return (
    <div
      className="container mt-2 p-3"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{ fontSize: "1.1rem", textAlign: "left", fontWeight: 700 }}
      >
        VOUCHER
      </h4>
      <hr />
      <ul className="list-unstyled" style={{ padding: 0 }}>
        {vouchers.map((voucher) => (
          <li
            key={voucher.id}
            className="mb-2"
            style={{
              backgroundColor: "#ffe5e5",
              borderLeft: "6px dashed #ff0000",
              borderRadius: 5,
              padding: "10px 15px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              id={voucher.id}
              name="voucher"
              value={voucher.id}
              checked={selectedVoucher === voucher.id}
              onChange={handleVoucherChange}
              style={{
                height: 20,
                width: 20,
                marginRight: 15,
                flexShrink: 0,
                cursor: "pointer",
              }}
            />
            <label 
              htmlFor={voucher.id} 
              style={{ 
                cursor: "pointer", 
                margin: 0,
                flex: 1 
              }}
            >
              <div className="fw-bold">{voucher.name}</div>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                {voucher.description}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voucher;