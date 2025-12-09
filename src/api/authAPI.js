import api from "./axiosInstance";

export const logOut = async (accessToken) => {
  try {
    const res = await api.post("/auth/logout", {
      token: accessToken,
    });
    localStorage.removeItem("accessToken");
    return res.data;
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};
