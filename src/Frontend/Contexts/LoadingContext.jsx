import { createContext, useState, useContext } from "react";
import PageLoader from "../components/PageLoader";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  showLoader: () => {},
  hideLoader: () => {},
});

// Thêm hook useLoading để sử dụng context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Đang tải...");

  const showLoader = (text = "Đang tải...") => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    showLoader,
    hideLoader,
    loadingText,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <PageLoader text={loadingText} />}
    </LoadingContext.Provider>
  );
};
