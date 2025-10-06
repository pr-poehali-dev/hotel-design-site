
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReportsPage from "./pages/ReportsPage";
import OwnersPage from "./pages/OwnersPage";
import OwnerReportsPage from "./pages/OwnerReportsPage";
import OwnerLoginPage from "./pages/OwnerLoginPage";
import OwnerRegisterPage from "./pages/OwnerRegisterPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import HousekeepingTable from "./pages/HousekeepingTable";
import CheckInInstructionsPage from "./pages/CheckInInstructionsPage";
import InstructionsListPage from "./pages/InstructionsListPage";
import GuestDashboardPage from "./pages/GuestDashboardPage";
import BookingsManagementPage from "./pages/BookingsManagementPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import FortuneWheelPage from "./pages/FortuneWheelPage";
import MyPromoCodesPage from "./pages/MyPromoCodesPage";
import LoyaltyProgram from "./pages/LoyaltyProgram";
import Location from "./pages/Location";
import Reviews from "./pages/Reviews";
import GoogleBusiness from "./pages/GoogleBusiness";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;