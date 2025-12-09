import React from "react";
import OrderItem from "./OrderedItem";  

const OrderedProducts = ({items}) => {
  const CartItems = items || []; // Truy cập đúng vào mảng chứa trong orderedProducts
  return (
    <div
      className="container p-3 mt-2"
      style={{ backgroundColor: "white", borderRadius: 10 }}
    >
      <h4
        className="text-muted"
        style={{
          fontSize: "1.1rem",
          textAlign: "left",
          fontWeight: 700,
        }}
      >
        TỔNG QUAN ĐƠN HÀNG
      </h4>
      <hr />
      <div className="cart-items-block">
        {CartItems.map((item, index) => (
          <React.Fragment key={index}>
            <OrderItem
              productName={item?.productName || ""}
              productImage={item?.productImage || ""}
              productPrice={item?.price ? item.price : ""}
              quantity={item?.quantity || ""}
            />
            {index < CartItems.length - 1 && (
              <hr
                style={{
                  margin: "8px 18px",
                  color: "rgb(153 153 153)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default OrderedProducts;