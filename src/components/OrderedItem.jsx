import React, { useState } from "react";
import "../style/Order.css"
import MoneyFormat from "../utils/MoneyFormat"

const OrderItem = ({
  productName,
  productPrice,
  productImage,
  quantity,
}) => {
  return (
    <div className="cart-item">
      {/* Hình ảnh sản phẩm */}
      <div className="cart-item-img">
        <img src={productImage} className="cart-item-img-img" />
      </div>

      {/* Tên và giá sản phẩm */}
      <div className="cart-item-info">
        <span className="cart-item-info-nameProduct">{productName}</span>
        <span className="cart-item-info-price text-muted">
          {/* {MoneyFormat(productPrice * (1 - discountPercent / 100) * quantity)} */}
          <div className="cart-item-quantity-block" style={{ border: "none" }}>
            <input type="number" value={quantity} onChange={() => {}} />
            </div>
        </span>
      </div>

      {/* khối chứa quantity và giá  */}
      <div className="cart-item-quantity-totalPrice">
        {/* Giá tổng */}
        <div className="cart-item-totalPrice">
          <span style={{ fontWeight: "500" }}>
            <span className="mx-1">{MoneyFormat(productPrice * quantity)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;