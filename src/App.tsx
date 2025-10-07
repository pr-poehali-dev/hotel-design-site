import * as React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = React.lazy(() => import("./pages/Index"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const OwnersPage = React.lazy(() => import("./pages/OwnersPage"));
const OwnerReportsPage = React.lazy(() => import("./pages/OwnerReportsPage"));
const OwnerLoginPage = React.lazy(() => import("./pages/OwnerLoginPage"));
const OwnerRegisterPage = React.lazy(() => import("./pages/OwnerRegisterPage"));
const OwnerDashboardPage = React.lazy(() => import("./pages/OwnerDashboardPage"));
const HousekeepingTable = React.lazy(() => import("./pages/HousekeepingTable"));
const CheckInInstructionsPage = React.lazy(() => import("./pages/CheckInInstructionsPage"));
const InstructionsListPage = React.lazy(() => import("./pages/InstructionsListPage"));
const GuestDashboardPage = React.lazy(() => import("./pages/GuestDashboardPage"));
const GuestLoginPage = React.lazy(() => import("./pages/GuestLoginPage"));
const GuestRegisterPage = React.lazy(() => import("./pages/GuestRegisterPage"));
const BookingsManagementPage = React.lazy(() => import("./pages/BookingsManagementPage"));
const AdminLoginPage = React.lazy(() => import("./pages/AdminLoginPage"));
const FortuneWheelPage = React.lazy(() => import("./pages/FortuneWheelPage"));
const MyPromoCodesPage = React.lazy(() => import("./pages/MyPromoCodesPage"));
const LoyaltyProgram = React.lazy(() => import("./pages/LoyaltyProgram"));
const Location = React.lazy(() => import("./pages/Location"));
const Reviews = React.lazy(() => import("./pages/Reviews"));
const GoogleBusiness = React.lazy(() => import("./pages/GoogleBusiness"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <React.Suspense fallback={<div />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/owners" element={<OwnersPage />} />
            <Route path="/owner/:apartmentId" element={<OwnerReportsPage />} />
            <Route path="/owner-login" element={<OwnerLoginPage />} />
            <Route path="/owner-register" element={<OwnerRegisterPage />} />
            <Route path="/owner-dashboard" element={<OwnerDashboardPage />} />
            <Route path="/housekeeping" element={<HousekeepingTable />} />
            <Route path="/check-in-instructions" element={<CheckInInstructionsPage />} />
            <Route path="/instructions-list" element={<InstructionsListPage />} />
            <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
            <Route path="/guest-login" element={<GuestLoginPage />} />
            <Route path="/guest-register" element={<GuestRegisterPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/bookings" element={<BookingsManagementPage />} />
            <Route path="/fortune-wheel" element={<FortuneWheelPage />} />
            <Route path="/my-promo-codes" element={<MyPromoCodesPage />} />
            <Route path="/loyalty-program" element={<LoyaltyProgram />} />
            <Route path="/location" element={<Location />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/google-business" element={<GoogleBusiness />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;