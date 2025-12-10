import { parseJwt } from "../utils/Common";
import api from "./axiosInstance";

/**
 * @param {object} orderData
 */
export const createOrder = async (orderData) => {
    try {
        const response = await api.post("/order", orderData);
        return response;
    } catch (err) {
        console.error("Lỗi khi tạo đơn hàng:", err);
        throw err;
    }
};

export const getMyOrders = async () => {
    const token = localStorage.getItem("accessToken");
    const customerId = parseJwt(token)?.customerID;
    try {
        const response = await api.get(`/order/${customerId}`);
        return response.data;
    } catch (err) {
        console.error("Lỗi khi tạo đơn hàng:", err);
        throw err;
    }
};

export const getAllOrder = async () => {
    const token = localStorage.getItem("accessToken");
    const customerId = parseJwt(token)?.customerID;
    try {
        const response = await api.get("/order");
        return response.data;
    } catch (err) {
        console.error("Lỗi khi tạo đơn hàng:", err);
        throw err;
    }
};

