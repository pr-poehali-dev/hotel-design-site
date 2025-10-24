import { useState } from 'react';
import BookingDialog from '@/components/BookingDialog';
import AdminLogin from '@/components/AdminLogin';
import { BookingRecord } from '@/types/booking';
import ReportsHeader from '@/components/reports/ReportsHeader';
import EmptyOwnersState from '@/components/reports/EmptyOwnersState';
import PendingPaymentsSection from '@/components/reports/PendingPaymentsSection';
import PaymentHistorySection from '@/components/reports/PaymentHistorySection';
import { useReportsData } from '@/components/reports/useReportsData';
import { useReportsActions } from '@/components/reports/useReportsActions';

const AUTH_KEY = 'premium_admin_auth';

const ReportsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const {
    owners,
    selectedApartment,
    setSelectedApartment,
    bookings,
    selectedMonth,
    setSelectedMonth,
    monthlyReports,
    loading,
    setLoading,
    commissionRate,
    loadBookings,
    loadMonthlyReports
  } = useReportsData(isAuthenticated);

  const {
    handleSaveBooking,
    handleDeleteBooking,
    handleMarkAsPaid,
    handleArchiveMonth,
    handleSendReport,
    handleShowAllToOwner,
    handleSyncBnovo
  } = useReportsActions({
    selectedApartment,
    bookings,
    setLoading,
    loadBookings,
    loadMonthlyReports
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | undefined>();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleAddBooking = () => {
    setEditingBooking(undefined);
    setDialogOpen(true);
  };

  const handleEditBooking = (booking: BookingRecord) => {
    setEditingBooking(booking);
    setDialogOpen(true);
  };

  const onSaveBooking = async (booking: BookingRecord) => {
    await handleSaveBooking(booking, editingBooking);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 to-white">
      <ReportsHeader
        owners={owners}
        selectedApartment={selectedApartment}
        onApartmentChange={setSelectedApartment}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        monthlyReports={monthlyReports}
        loading={loading}
        onShowAllToOwner={handleShowAllToOwner}
        onArchiveMonth={handleArchiveMonth}
        onSyncBnovo={handleSyncBnovo}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-6 py-12">
        {owners.length === 0 ? (
          <EmptyOwnersState />
        ) : selectedApartment ? (
          <>
            <PendingPaymentsSection
              bookings={bookings}
              selectedMonth={selectedMonth}
              commissionRate={commissionRate}
              onAddBooking={handleAddBooking}
              onEditBooking={handleEditBooking}
              onDeleteBooking={handleDeleteBooking}
              onSendReport={handleSendReport}
              onMarkAsPaid={handleMarkAsPaid}
            />

            <PaymentHistorySection
              bookings={bookings}
              selectedMonth={selectedMonth}
              commissionRate={commissionRate}
              onEditBooking={handleEditBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          </>
        ) : null}
      </main>

      <BookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={onSaveBooking}
        booking={editingBooking}
        commissionRate={commissionRate}
      />
    </div>
  );
};

export default ReportsPage;