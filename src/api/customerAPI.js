import api from "./axiosInstance";

export const getInfo = async (id) => {
  try {
    const res = await api.get(`/customer/profile/${id}`);
    return res.data.result;
  } catch (error) {
    console.error("Get profile error:", error.response?.data || error.message);
    throw error;
  }
};
export const updateProfile = async (id, data) => {
  const res = await api.put(`/customer/${id}`, data);
  return res.data.result;
};
export const getCustomers = async () => {
  try {
    const res = await api.get(`/customer`);
    return res.data.result;
  } catch (error) {
    console.error("Get customer error:", error.response?.data || error.message);
    throw error;
  }
};
