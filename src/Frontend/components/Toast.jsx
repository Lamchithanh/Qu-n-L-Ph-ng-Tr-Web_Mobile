import React from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "../Contexts/ToastContext";

const Toast = () => {
  const { toast } = useToast();

  if (!toast.show) return null;

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const backgrounds = {
    success: "bg-green-100 border-green-500",
    error: "bg-red-100 border-red-500",
    warning: "bg-yellow-100 border-yellow-500",
    info: "bg-blue-100 border-blue-500",
  };

  // Sử dụng inline style với z-index cao
  const toastContainerStyle = {
    position: "fixed",
    top: "90px", // Điều chỉnh vị trí phù hợp để không bị che bởi header
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10000, // Giá trị cao hơn z-index của header (9000)
  };

  return (
    <div style={toastContainerStyle}>
      <div
        className={`
          flex items-center p-4 rounded-lg shadow-lg border
          transform transition-all duration-300 ease-out
          translate-y-0 opacity-100
          ${backgrounds[toast.type]}
        `}
      >
        <div className="mr-3">{icons[toast.type]}</div>
        <p className="text-gray-800 font-medium">{toast.message}</p>
      </div>
    </div>
  );
};

export default Toast;
