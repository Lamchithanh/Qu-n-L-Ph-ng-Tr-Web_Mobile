// ChatContext.jsx
import React, { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    if (message.sender === "owner") {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        unreadCount,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
