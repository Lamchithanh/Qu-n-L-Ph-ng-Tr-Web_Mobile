// src/Frontend/services/authService.js
const BASE_URL = "/api/users";

export const authService = {
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng nhập thất bại");
    }

    const data = await response.json();
    // Lưu token vào localStorage
    localStorage.setItem("userToken", data.token);
    return data;
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng ký thất bại");
    }

    const data = await response.json();
    return data;
  },

  logout() {
    localStorage.removeItem("userToken");
  },

  isAuthenticated() {
    return !!localStorage.getItem("userToken");
  },
};
