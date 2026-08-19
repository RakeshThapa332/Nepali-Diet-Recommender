import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshRequest: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refresh_token");

    if (
      error.response?.status !== 401 ||
      !refreshToken ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshRequest ??= axios
      .post<{ access_token: string }>(
        `${api.defaults.baseURL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      )
      .then(({ data }) => {
        localStorage.setItem("access_token", data.access_token);
        return data.access_token;
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth:expired"));
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });

    const newToken = await refreshRequest;
    if (!newToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newToken}`;
    return api(originalRequest);
  }
);

export default api;