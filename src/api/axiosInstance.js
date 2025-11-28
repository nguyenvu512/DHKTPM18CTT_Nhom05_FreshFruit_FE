import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Trạng thái khi đang refresh token
let isRefreshing = false;
let refreshSubscribers = [];

// Khi có token mới, gọi lại các request bị pending
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

// ✅ Interceptor trước khi gửi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor sau khi nhận response
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn → 401 Unauthorized
    if (error.data?.code === 1406 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const res = await axios.post(
            "http://localhost:8080/api/auth/refresh",
            {},
            { withCredentials: true }
          );
          const newToken = res.data.result.accessToken;
          localStorage.setItem("accessToken", newToken);
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          window.location.href = "/login"; // token invalid → logout
          return Promise.reject(err);
        }
      }

      // Chờ token mới xong rồi retry lại request cũ
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
