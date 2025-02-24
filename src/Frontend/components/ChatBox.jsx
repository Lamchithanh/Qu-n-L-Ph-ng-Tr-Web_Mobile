import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image,
  Paperclip,
  MoreVertical,
  Phone,
  Info,
  Circle,
} from "lucide-react";
import { generateResponse } from "../Service/chatService.js";
import AvatarAdmin from "../../assets/cabipara.jpg";

const ChatBox = () => {
  // Thêm state cho lịch sử hội thoại
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "owner",
      content:
        "Xin chào! Tôi có thể giúp gì cho bạn? Mọi thông tin liên hệ chi tiết đến Zalo: 0981911449.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Thay đổi timestamp để hiển thị thời gian thực
      status: "read",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Cập nhật hàm handleSend
  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() && !isProcessing) {
      setIsProcessing(true);
      setIsTyping(true);

      const userMessage = {
        id: messages.length + 1,
        sender: "tenant",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Luôn sử dụng thời gian thực
        status: "sent",
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");

      const updatedHistory = [
        ...conversationHistory,
        { role: "user", content: newMessage },
      ];
      setConversationHistory(updatedHistory);

      try {
        const aiResponse = await generateResponse(newMessage, updatedHistory);

        const responseMessage = {
          id: messages.length + 2,
          sender: "owner",
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }), // Luôn sử dụng thời gian thực
          status: "sent",
        };

        setMessages((prev) => [...prev, responseMessage]);
        setConversationHistory((prev) => [
          ...prev,
          {
            role: "assistant",
            content: aiResponse,
          },
        ]);
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsTyping(false);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[600px] bg-white rounded-xl shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-indigo-600 rounded-t-xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={AvatarAdmin}
              alt="Owner"
              className="w-10 h-10 rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-semibold text-white">ChatBox</h3>
            <p className="text-xs text-indigo-100">Trực tuyến</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-white">
          <button className="p-2 hover:bg-indigo-700 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-indigo-700 rounded-full">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-indigo-700 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "tenant" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "tenant"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white shadow-sm rounded-bl-none"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <div
                className={`text-xs mt-1 flex items-center gap-1 ${
                  message.sender === "tenant"
                    ? "text-indigo-100"
                    : "text-gray-500"
                }`}
              >
                {message.timestamp}
                {message.sender === "tenant" && (
                  <span>
                    {message.status === "read" ? (
                      <Circle className="w-3 h-3 fill-current" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="text-sm">Chủ trọ đang nhập...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
