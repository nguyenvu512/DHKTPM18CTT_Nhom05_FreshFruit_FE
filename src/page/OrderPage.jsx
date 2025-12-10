import React, { useState } from "react";
import AddressForm from "../components/AddressForm";
import ShippingMethod from "../components/ShippingMethod";
import PaymentMethods from "../components/PaymentMethod";
import Voucher from "../components/Voucher";
import { useLocation } from "react-router-dom";
import OrderedProducts from "../components/OrderedProducts";
import PaymentInfo from "../components/PaymentInfo";

const OrderPage = () => {
    const {state} = useLocation();
    const orderedProducts = state?.items;
    const [addressInfo, setAddressInfo] = useState();
    const [paymentInfo, setPaymentInfo] = useState();
    const [voucherInfo, setVoucherInfo] = useState();

    const setAddress = (dataAddress) => {
        setAddressInfo(dataAddress);
    };
    const setPaymentMethod = (data) => {
        setPaymentInfo(data);
    };
    
    const setVoucher = (data) => {
        setVoucherInfo(data);
    };
    return (
        <>
            <div className="container mt-3">
                <div className="row">

                {/* Cột trái – 4 component */}
                <div className="col-12 col-lg-7 d-flex flex-column gap-3">
                    <AddressForm setAddress={setAddress} />
                    <ShippingMethod />
                    <PaymentMethods setPaymentMethod={setPaymentMethod} />
                    <Voucher setVoucher={setVoucher} />
                </div>

                {/* Cột phải – OrderedProducts */}
                <div className="col-12 col-lg-5 mt-3 mt-lg-0">
                    <OrderedProducts items={orderedProducts} />
                    <PaymentInfo 
                        orderedProducts={orderedProducts}
                        addressInfo={addressInfo}
                        paymentMethod={paymentInfo}
                        voucherInfo={voucherInfo}
                    />
                </div>

                </div>
            </div>
        </>

    );
};

export default OrderPage;
