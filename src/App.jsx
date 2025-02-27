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
import DashboardLayout from "./Frontend/pages/Landlord/DashboardLayout.jsx";
import DashboardOverview from "./Frontend/pages/Landlord/DashboardOverview.jsx";
import LandlordProfile from "./Frontend/pages/Landlord/LandlordProfile.jsx";
import RoomsManagement from "./Frontend/pages/Landlord/RoomsManagement.jsx";
import ContractsManagement from "./Frontend/pages/Landlord/ContractsManagement.jsx";
import ServicesManagement from "./Frontend/pages/Landlord/ServicesManagement.jsx";
import InvoicesManagement from "./Frontend/pages/Landlord/InvoicesManagement.jsx";
import PaymentsManagement from "./Frontend/pages/Landlord/PaymentsManagement.jsx";
import ReviewsManagement from "./Frontend/pages/Landlord/ReviewsManagement.jsx";
import DashboardSettings from "./Frontend/pages/Landlord/DashboardSettings.jsx";
import AdminDashboardLayout from "./Frontend/pages/Admin/AdminDashboardLayout.jsx";
import AdminDashboardOverview from "./Frontend/pages/Admin/AdminDashboardOverview.jsx";
import LandlordsManagement from "./Frontend/pages/Admin/LandlordsManagement.jsx";
import AdminRoomsManagement from "./Frontend/pages/Admin/RoomsManagement.jsx";
import AdminContractsManagement from "./Frontend/pages/Admin/AdminContractsManagement.jsx";
import AdminServicesManagement from "./Frontend/pages/Admin/AdminServicesManagement.jsx";
import InvoicesPaymentsManagement from "./Frontend/pages/Admin/InvoicesPaymentsManagement.jsx";

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

                  {/* Dashboard routes */}
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route
                      path="LandlordProfile"
                      element={<LandlordProfile />}
                    />
                    <Route
                      path="RoomsManagement"
                      element={<RoomsManagement />}
                    />

                    <Route path="contracts" element={<ContractsManagement />} />
                    <Route path="services" element={<ServicesManagement />} />
                    <Route path="invoices" element={<InvoicesManagement />} />
                    <Route path="payments" element={<PaymentsManagement />} />
                    <Route path="reviews" element={<ReviewsManagement />} />
                    <Route path="settings" element={<DashboardSettings />} />
                  </Route>

                  {/* Dashboard Super Admin */}
                  <Route path="/admin" element={<AdminDashboardLayout />}>
                    <Route index element={<AdminDashboardOverview />} />
                    <Route path="landlords" element={<LandlordsManagement />} />
                    <Route path="rooms" element={<AdminRoomsManagement />} />
                    <Route
                      path="contracts"
                      element={<AdminContractsManagement />}
                    />
                    <Route
                      path="services"
                      element={<AdminServicesManagement />}
                    />

                    <Route
                      path="payments"
                      element={<InvoicesPaymentsManagement />}
                    />
                    {/* <Route path="reviews" element={<ReviewsManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="settings" element={<AdminSettings />} /> */}
                  </Route>
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
