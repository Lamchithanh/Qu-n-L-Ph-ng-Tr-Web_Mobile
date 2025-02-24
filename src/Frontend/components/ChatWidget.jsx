import React, { useState, useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const chatRef = useRef(null);
  const notificationTimeout = useRef(null);
  const notificationInterval = useRef(null);

  useEffect(() => {
    // Thiết lập thông báo sau 5 phút
    notificationTimeout.current = setTimeout(() => {
      if (!isOpen) {
        setShowNotification(true);

        // Tạo hiệu ứng nhấp nháy nhẹ cho thông báo
        notificationInterval.current = setInterval(() => {
          setShowNotification((prev) => !prev);
        }, 5000);
      }
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(notificationTimeout.current);
      clearInterval(notificationInterval.current);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowNotification(false);
    clearInterval(notificationInterval.current);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div ref={chatRef} className="relative">
          <div className="absolute bottom-0 right-0 w-[400px] h-[600px] shadow-2xl rounded-2xl overflow-hidden">
            <ChatBox />
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={handleOpenChat}
            className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {showNotification && (
            <div className="absolute bottom-full right-0 mb-4">
              <div
                className="bg-white rounded-lg shadow-lg p-4 animate-bounce"
                style={{ width: "280px" }}
              >
                <div className="relative">
                  <p className="text-gray-800 font-medium text-sm">
                    Bạn cần tư vấn về phòng trọ?
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Chat ngay với chúng tôi!
                  </p>
                  <div className="absolute -bottom-2 right-4 transform translate-y-full">
                    <div className="border-8 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
