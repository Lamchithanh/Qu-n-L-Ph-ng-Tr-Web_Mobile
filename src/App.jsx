import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  LoadingProvider,
  useLoading,
} from "./Frontend/Contexts/LoadingContext";
import { ToastProvider } from "./Frontend/Contexts/ToastContext";
import Toast from "./Frontend/components/Toast";
import MainLayout from "./Frontend/layouts/MainLayout";
import PageLoader from "./Frontend/components/PageLoader";
import { ChatProvider } from "./Frontend/Contexts/ChatContext";

// Lazy load components với prefetch
const Homepage = lazy(() => import("./Frontend/pages/HomePage"));
const RoomDetail = lazy(() => import("./Frontend/pages/RoomDetail"));
const ProfilePage = lazy(() => import("./Frontend/pages/ProfilePage"));
const BillPayment = lazy(() => import("./Frontend/pages/BillPayment"));
const RentalContract = lazy(() => import("./Frontend/pages/RentalContract"));
const PaymentConfirmation = lazy(() =>
  import("./Frontend/pages/PaymentConfirmation")
);
const PaymentSuccess = lazy(() => import("./Frontend/Contexts/PaymentSuccess"));
const ContactPage = lazy(() => import("./Frontend/pages/ContactPage"));
const AboutPage = lazy(() => import("./Frontend/pages/AboutPage"));
const ServicesPage = lazy(() => import("./Frontend/pages/ServicesPage"));
const Auth = lazy(() => import("./Frontend/pages/Auth"));
const LandlordRegistration = lazy(() =>
  import("./Frontend/pages/LandlordRegistration")
);
const TenantManagement = lazy(() =>
  import("./Frontend/pages/TenantManagement.jsx")
);
const NotificationPage = lazy(() =>
  import("./Frontend/pages/NotificationPage")
);
const MaintenanceRequest = lazy(() =>
  import("./Frontend/pages/MaintenanceRequest")
);

// NavigationTracker component
const NavigationTracker = ({ children }) => {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoading();

  React.useEffect(() => {
    showLoader();
    const minLoadTime = setTimeout(() => {
      hideLoader();
    }, 300);

    return () => clearTimeout(minLoadTime);
  }, [location.pathname]);

  return children;
};

// App component chính
const App = () => {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <ToastProvider>
          <ChatProvider>
            <Toast />
            <NavigationTracker>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Homepage />} />
                    <Route path="/room/:id" element={<RoomDetail />} />
                    <Route path="/ProfilePage" element={<ProfilePage />} />
                    <Route path="/BillPayment" element={<BillPayment />} />
                    <Route
                      path="/RentalContract/:id"
                      element={<RentalContract />}
                    />
                    <Route path="/ContactPage" element={<ContactPage />} />
                    <Route path="/AboutPage" element={<AboutPage />} />
                    <Route path="/ServicesPage" element={<ServicesPage />} />
                    <Route
                      path="/TenantManagement"
                      element={<TenantManagement />}
                    />
                    <Route
                      path="/NotificationPage"
                      element={<NotificationPage />}
                    />
                    <Route
                      path="/MaintenanceRequest"
                      element={<MaintenanceRequest />}
                    />
                    <Route
                      path="/payment-confirmation"
                      element={<PaymentConfirmation />}
                    />
                    <Route
                      path="/payment-success"
                      element={<PaymentSuccess />}
                    />
                  </Route>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/register-landlord"
                    element={<LandlordRegistration />}
                  />
                </Routes>
              </Suspense>
            </NavigationTracker>
          </ChatProvider>
        </ToastProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
