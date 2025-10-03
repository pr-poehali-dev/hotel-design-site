import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import BookingDialog from '@/components/BookingDialog';
import AdminLogin from '@/components/AdminLogin';
import { BookingRecord } from '@/types/booking';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

const STORAGE_KEY = 'premium_apartments_bookings';
const AUTH_KEY = 'premium_admin_auth';

const ReportsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bookings', e);
      }
    }
    return [
    {
      id: '1',
      checkIn: '2025-03-01',
      checkOut: '2025-03-02',
      earlyCheckIn: 0,
      lateCheckOut: 0,
      parking: 0,
      accommodationAmount: 22000,
      totalAmount: 22000,
      aggregatorCommission: 0,
      taxAndBankCommission: 1540,
      remainderBeforeManagement: 22000,
      managementCommission: 4400,
      remainderBeforeExpenses: 17600,
      operatingExpenses: 6000,
      ownerFunds: 11600,
      paymentToOwner: 0,
      paymentDate: '',
      maid: 2000,
      laundry: 500,
      hygiene: 3000,
      transport: 0,
      compliment: 500,
      other: 0,
      otherNote: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      showToGuest: false,
    },
    {
      id: '2',
      checkIn: '2025-03-04',
      checkOut: '2025-03-06',
      earlyCheckIn: 0,
      lateCheckOut: 0,
      parking: 0,
      accommodationAmount: 25200,
      totalAmount: 25200,
      aggregatorCommission: 15,
      taxAndBankCommission: 1764,
      remainderBeforeManagement: 21420,
      managementCommission: 4284,
      remainderBeforeExpenses: 17136,
      operatingExpenses: 3000,
      ownerFunds: 14136,
      paymentToOwner: 0,
      paymentDate: '',
      maid: 2000,
      laundry: 500,
      hygiene: 0,
      transport: 0,
      compliment: 500,
      other: 0,
      otherNote: '',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      showToGuest: false,
    },
  ];
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | undefined>();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

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

  const handleSaveBooking = (booking: BookingRecord) => {
    if (editingBooking) {
      setBookings(bookings.map(b => b.id === booking.id ? booking : b));
    } else {
      setBookings([...bookings, booking]);
    }
  };

  const handleDeleteBooking = (id: string) => {
    if (confirm('Удалить это бронирование?')) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 to-white">
      <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <div>
                <h1 className="font-playfair font-bold text-2xl text-gold-400">Premium Apartments</h1>
                <p className="text-sm text-gray-400 font-inter">Поклонная 9 - апартамент 2019</p>
              </div>
            </div>
            <div className="flex gap-3">
              <FizzyButton
                onClick={() => window.location.href = '/'}
                variant="secondary"
                icon={<Icon name="Home" size={18} />}
              >
                На главную
              </FizzyButton>
              <FizzyButton
                onClick={handleLogout}
                variant="secondary"
                icon={<Icon name="LogOut" size={18} />}
              >
                Выйти
              </FizzyButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <ReportsTable
          bookings={bookings}
          onAddBooking={handleAddBooking}
          onEditBooking={handleEditBooking}
          onDeleteBooking={handleDeleteBooking}
        />
      </main>

      <BookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveBooking}
        booking={editingBooking}
      />
    </div>
  );
};

export default ReportsPage;