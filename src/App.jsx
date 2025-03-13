import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  LoadingProvider,
  useLoading,
} from "./Frontend/Contexts/LoadingContext";
import { ToastProvider } from "./Frontend/Contexts/ToastContext";
import Toast from "./Frontend/components/Toast";
import PageLoader from "./Frontend/components/PageLoader";
import { ChatProvider } from "./Frontend/Contexts/ChatContext";

// Lazy load components
const MainLayout = lazy(() => import("./Frontend/layouts/MainLayout"));
const DashboardLayout = lazy(() =>
  import("./Frontend/pages/Landlord/DashboardLayout")
);
const DashboardOverview = lazy(() =>
  import("./Frontend/pages/Landlord/DashboardOverview")
);
const LandlordProfile = lazy(() =>
  import("./Frontend/pages/Landlord/LandlordProfile")
);
const RoomsManagement = lazy(() =>
  import("./Frontend/pages/Landlord/RoomsManagement")
);
const ContractsManagement = lazy(() =>
  import("./Frontend/pages/Landlord/ContractsManagement")
);
const ServicesManagement = lazy(() =>
  import("./Frontend/pages/Landlord/ServicesManagement")
);
const InvoicesManagement = lazy(() =>
  import("./Frontend/pages/Landlord/InvoicesManagement")
);
const PaymentsManagement = lazy(() =>
  import("./Frontend/pages/Landlord/PaymentsManagement")
);
const ReviewsManagement = lazy(() =>
  import("./Frontend/pages/Landlord/ReviewsManagement")
);
const DashboardSettings = lazy(() =>
  import("./Frontend/pages/Landlord/DashboardSettings")
);
const AdminDashboardLayout = lazy(() =>
  import("./Frontend/pages/Admin/AdminDashboardLayout")
);
const AdminDashboardOverview = lazy(() =>
  import("./Frontend/pages/Admin/AdminDashboardOverview")
);
const LandlordsManagement = lazy(() =>
  import("./Frontend/pages/Admin/LandlordsManagement")
);
const AdminRoomsManagement = lazy(() =>
  import("./Frontend/pages/Admin/RoomsManagement")
);
const AdminContractsManagement = lazy(() =>
  import("./Frontend/pages/Admin/AdminContractsManagement")
);
const AdminServicesManagement = lazy(() =>
  import("./Frontend/pages/Admin/AdminServicesManagement")
);
const InvoicesPaymentsManagement = lazy(() =>
  import("./Frontend/pages/Admin/InvoicesPaymentsManagement")
);
const AdminInvoicesManagement = lazy(() =>
  import("./Frontend/pages/Admin/AdminInvoicesManagement")
);
const AdminReviewsManagement = lazy(() =>
  import("./Frontend/pages/Admin/AdminReviewsManagement")
);
const AdminUserManagement = lazy(() =>
  import("./Frontend/pages/Admin/AdminUserManagement")
);
const AquacultureDashboard = lazy(() =>
  import("./Frontend/pages/Admin/AdminSettings")
);
const ForgotPassword = lazy(() => import("./Frontend/Contexts/ForgotPassword"));
const Homepage = lazy(() => import("./Frontend/pages/HomePage"));
const RoomDetail = lazy(() => import("./Frontend/pages/RoomDetail"));
const ProfilePage = lazy(() => import("./Frontend/pages/ProfilePage"));
const BillPayment = lazy(() => import("./Frontend/pages/BillPayment"));
const RentalContract = lazy(() => import("./Frontend/pages/RentalContract"));
const PaymentConfirmation = lazy(() =>
  import("./Frontend/pages/PaymentConfirmation")
);
const PaymentSuccess = lazy(() => import("./Frontend/Contexts/PaymentSuccess"));
const SignedContractPage = lazy(() =>
  import("./Frontend/pages/SignedContractPage")
);
const ContactPage = lazy(() => import("./Frontend/pages/ContactPage"));
const AboutPage = lazy(() => import("./Frontend/pages/AboutPage"));
const ServicesPage = lazy(() => import("./Frontend/pages/ServicesPage"));
const Auth = lazy(() => import("./Frontend/pages/Auth"));
const LandlordRegistration = lazy(() =>
  import("./Frontend/pages/LandlordRegistration")
);
const TenantManagement = lazy(() =>
  import("./Frontend/pages/TenantManagement")
);
const NotificationPage = lazy(() =>
  import("./Frontend/pages/NotificationPage")
);
const MaintenanceRequest = lazy(() =>
  import("./Frontend/pages/MaintenanceRequest")
);

const NavigationTracker = ({ children }) => {
  const location = useLocation();
  const { showLoader, hideLoader } = useLoading();

  React.useEffect(() => {
    showLoader();
    const minLoadTime = setTimeout(() => hideLoader(), 300);
    return () => clearTimeout(minLoadTime);
  }, [location.pathname]);

  return children;
};

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
                    <Route path="room/:id" element={<RoomDetail />} />
                    <Route path="/ProfilePage" element={<ProfilePage />} />
                    <Route path="/BillPayment" element={<BillPayment />} />
                    <Route
                      path="/SignedContractPage"
                      element={<SignedContractPage />}
                    />
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
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/register-landlord"
                    element={<LandlordRegistration />}
                  />
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
                      path="invoices"
                      element={<AdminInvoicesManagement />}
                    />
                    <Route
                      path="payments"
                      element={<InvoicesPaymentsManagement />}
                    />
                    <Route
                      path="reviews"
                      element={<AdminReviewsManagement />}
                    />
                    <Route path="users" element={<AdminUserManagement />} />
                    <Route path="settings" element={<AquacultureDashboard />} />
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
