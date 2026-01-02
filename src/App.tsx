import { lazy, Suspense, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateNotification from "@/components/UpdateNotification";
import { startVersionChecking, reloadApp } from "@/utils/versionCheck";
import BookingPage from "./pages/BookingPage";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const HousekeepingTable = lazy(() => import("./pages/HousekeepingTable"));
const CheckInInstructionsPage = lazy(() => import("./pages/CheckInInstructionsPage"));
const InstructionsListPage = lazy(() => import("./pages/InstructionsListPage"));

const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const Location = lazy(() => import("./pages/Location"));
const Reviews = lazy(() => import("./pages/Reviews"));
const GoogleBusiness = lazy(() => import("./pages/GoogleBusiness"));
const TestAPI = lazy(() => import("./pages/TestAPI"));
const PayrollPage = lazy(() => import("./pages/PayrollPage"));
const HousekeeperLoginPage = lazy(() => import("./pages/HousekeeperLoginPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const HashTestPage = lazy(() => import("./pages/HashTestPage"));
const PushNotificationsPage = lazy(() => import("./pages/PushNotificationsPage"));


const queryClient = new QueryClient();

const App = () => {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
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
        <Suspense fallback={<div style={{ display: 'none' }} />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/housekeeping" element={<HousekeepingTable />} />
            <Route path="/check-in-instructions" element={<CheckInInstructionsPage />} />
            <Route path="/instructions-list" element={<InstructionsListPage />} />

            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/location" element={<Location />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/google-business" element={<GoogleBusiness />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/housekeeper-login" element={<HousekeeperLoginPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/hash-test" element={<HashTestPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/push-notifications" element={<PushNotificationsPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;