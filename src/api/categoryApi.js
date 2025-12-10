// src/api/categoryApi.js
import api from "./axiosInstance"; // axios instance của bạn

/**
 * Lấy danh sách tất cả danh mục
 */
export const getAllCategories = async () => {
    try {
        const response = await api.get("/category");
        return response.data.result; // trả về mảng danh mục
    } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        throw err;
    }
};

/**
 * Tạo danh mục mới
 * @param {object} categoryData
 */
export const createCategory = async (categoryData) => {
    try {
        const response = await api.post("/category", categoryData);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi tạo danh mục:", err);
        throw err;
    }
};

/**
 * Cập nhật danh mục
 * @param {string} id
 * @param {object} categoryData
 */
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/category/${id}`, categoryData);
        return response.data.result;
    } catch (err) {
        console.error("Lỗi khi cập nhật danh mục:", err);
        throw err;
    }
};

/**
 * Xóa danh mục
 * @param {string} id
 */
export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/category/${id}`);
        return response.data.result; // "Xóa danh mục thành công"
    } catch (err) {
        console.error("Lỗi khi xóa danh mục:", err);
        throw err;
    }
};