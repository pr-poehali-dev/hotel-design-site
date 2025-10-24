import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateNotification from "@/components/UpdateNotification";
import { startVersionChecking, reloadApp } from "@/utils/versionCheck";

const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const OwnersPage = React.lazy(() => import("./pages/OwnersPage"));
const OwnerReportsPage = React.lazy(() => import("./pages/OwnerReportsPage"));
const OwnerLoginPage = React.lazy(() => import("./pages/OwnerLoginPage"));
const OwnerDashboardPage = React.lazy(() => import("./pages/OwnerDashboardPage"));
const HousekeepingTable = React.lazy(() => import("./pages/HousekeepingTable"));
const CheckInInstructionsPage = React.lazy(() => import("./pages/CheckInInstructionsPage"));
const InstructionsListPage = React.lazy(() => import("./pages/InstructionsListPage"));

const AdminLoginPage = React.lazy(() => import("./pages/AdminLoginPage"));
const FortuneWheelPage = React.lazy(() => import("./pages/FortuneWheelPage"));
const MyPromoCodesPage = React.lazy(() => import("./pages/MyPromoCodesPage"));
const LoyaltyProgram = React.lazy(() => import("./pages/LoyaltyProgram"));
const Location = React.lazy(() => import("./pages/Location"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const GoogleBusiness = React.lazy(() => import("./pages/GoogleBusiness"));
const TestAPI = React.lazy(() => import("./pages/TestAPI"));
const PayrollPage = React.lazy(() => import("./pages/PayrollPage"));
const HousekeeperLoginPage = React.lazy(() => import("./pages/HousekeeperLoginPage"));
const CalendarPage = React.lazy(() => import("./pages/CalendarPage"));
const AdminOwnersPage = React.lazy(() => import("./pages/AdminOwnersPage"));
const HashTestPage = React.lazy(() => import("./pages/HashTestPage"));
const BookingPage = React.lazy(() => import("./pages/BookingPage"));
const PushNotificationsPage = React.lazy(() => import("./pages/PushNotificationsPage"));


const queryClient = new QueryClient();

const App = () => {
  const [showUpdateNotification, setShowUpdateNotification] = React.useState(false);

  React.useEffect(() => {
    startVersionChecking(() => {
      setShowUpdateNotification(true);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <UpdateNotification
          show={showUpdateNotification}
          onUpdate={reloadApp}
          onDismiss={() => setShowUpdateNotification(false)}
        />
        <BrowserRouter>
        <React.Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-xl">Загрузка...</div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/owner/:apartmentId" element={<OwnerReportsPage />} />
            <Route path="/owner-login" element={<OwnerLoginPage />} />
            <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
            <Route path="/housekeeping" element={<HousekeepingTable />} />
            <Route path="/check-in-instructions" element={<CheckInInstructionsPage />} />
            <Route path="/instructions-list" element={<InstructionsListPage />} />

            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/fortune-wheel" element={<FortuneWheelPage />} />
            <Route path="/my-promo-codes" element={<MyPromoCodesPage />} />
            <Route path="/loyalty-program" element={<LoyaltyProgram />} />
            <Route path="/location" element={<Location />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/google-business" element={<GoogleBusiness />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/housekeeper-login" element={<HousekeeperLoginPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin/owners" element={<AdminOwnersPage />} />
            <Route path="/hash-test" element={<HashTestPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/push-notifications" element={<PushNotificationsPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;