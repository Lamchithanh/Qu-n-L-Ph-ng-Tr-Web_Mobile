import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    // Hiển thị toast
    setToast({ show: true, message, type });

    // Đặt timeout để ẩn toast
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));

      // Xóa message sau khi animation kết thúc
      setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 300); // Thời gian bằng với duration của animation
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
