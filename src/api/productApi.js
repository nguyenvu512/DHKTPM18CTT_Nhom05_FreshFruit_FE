// src/api/productApi.js
import api from "./axiosInstance"; // import axios instance của bạn
import axios from "axios";

/**
 * Lấy danh sách tất cả sản phẩm
 */
export const getAllProducts = async () => {
    try {
        const response = await api.get("/product");
        return response.data.result; // trả về mảng result
    } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
        throw err;
    }
};

/**
 * Lấy chi tiết sản phẩm theo id
 * @param {string} id
 */
export const getProductById = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
        throw err;
    }
};

/**
 * Thêm sản phẩm mới
 * @param {FormData} formData
 */
export const createProduct = async (formData) => {
    try {
        // Không cần tự set headers Content-Type
        const response = await api.post("/product", formData);
        return response.data;
    } catch (err) {
        console.error("Lỗi khi tạo sản phẩm:", err);
        throw err;
    }
};


/**
 * Cập nhật sản phẩm
 * @param {string} id
 * @param {FormData} formData
 */
export const updateProduct = async (id, formData) => {
    try {
        const response = await api.put(`/product/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // bắt buộc để gửi file
            },
        });
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi cập nhật sản phẩm:", err);
        throw err; // để component handle lỗi
    }
};

/**
 * Xóa sản phẩm
 * @param {string} id
 */
export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/product/${id}`);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        throw err;
    }
};
