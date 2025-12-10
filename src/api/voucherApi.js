// src/api/voucherApi.js
import api from "./axiosInstance";

/**
 * Lấy danh sách tất cả voucher
 */
export const getAllVouchers = async () => {
    try {
        const response = await api.get("/voucher");
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi lấy voucher:", err);
        throw err;
    }
};

/**
 * Lấy chi tiết voucher theo id
 * @param {string} id
 */
export const getVoucherById = async (id) => {
    try {
        const response = await api.get(`/voucher/${id}`);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết voucher:", err);
        throw err;
    }
};

/**
 * Thêm voucher mới
 * @param {object} voucherData
 */
export const createVoucher = async (voucherData) => {
    try {
        const response = await api.post("/voucher", voucherData);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi tạo voucher:", err);
        throw err;
    }
};

/**
 * Cập nhật voucher
 * @param {string} id
 * @param {object} voucherData
 */
export const updateVoucher = async (id, voucherData) => {
    try {
        const response = await api.put(`/voucher/${id}`, voucherData);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi cập nhật voucher:", err);
        throw err;
    }
};

