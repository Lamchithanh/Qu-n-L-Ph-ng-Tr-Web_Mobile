import { createContext } from "react";

export const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  showLoader: () => {},
  hideLoader: () => {},
});
