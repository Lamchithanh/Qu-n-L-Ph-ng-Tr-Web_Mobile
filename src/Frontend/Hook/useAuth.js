// src/Frontend/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../Service/authService";

export const useAuth = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = (formData, isLogin) => {
    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }

    return true;
  };

  const handleAuth = async (formData, isLogin) => {
    setError("");

    // Validate form
    if (!validateForm(formData, isLogin)) return false;

    try {
      // Chọn phương thức đăng nhập hoặc đăng ký
      const authMethod = isLogin ? authService.login : authService.register;

      // Loại bỏ các trường không cần thiết
      const { confirmPassword, ...authData } = formData;

      // Thực hiện xác thực
      const response = await authMethod(authData);

      // Xử lý sau khi xác thực thành công
      console.log("Xác thực thành công:", response);

      // Chuyển hướng sau khi đăng nhập/đăng ký
      navigate("/");

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { error, handleAuth };
};
