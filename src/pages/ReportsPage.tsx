import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import BookingDialog from '@/components/BookingDialog';
import AdminLogin from '@/components/AdminLogin';
import { BookingRecord } from '@/types/booking';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { bookingsAPI } from '@/api/bookings';

const AUTH_KEY = 'premium_admin_auth';

const APARTMENTS = [
  { id: '2019', name: 'Апартамент 2019' },
  { id: '2119', name: 'Апартамент 2119' },
  { id: '2817', name: 'Апартамент 2817' },
  { id: '1116', name: 'Апартамент 1116' },
  { id: '1522', name: 'Апартамент 1522' },
  { id: '1401', name: 'Апартамент 1401' },
  { id: '2111', name: 'Апартамент 2111' },
  { id: '2110', name: 'Апартамент 2110' },
  { id: '1311', name: 'Апартамент 1311' },
  { id: '906', name: 'Апартамент 906' },
  { id: '816', name: 'Апартамент 816' },
];

const ReportsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  
  const [selectedApartment, setSelectedApartment] = useState('2019');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | undefined>();
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingsAPI.getBookings(selectedApartment);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [selectedApartment]);

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

  const handleSaveBooking = async (booking: BookingRecord) => {
    setLoading(true);
    try {
      const bookingWithApartment = { ...booking, apartmentId: selectedApartment };
      if (editingBooking) {
        await bookingsAPI.updateBooking(bookingWithApartment);
      } else {
        await bookingsAPI.createBooking(bookingWithApartment);
      }
      await loadBookings();
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Ошибка при сохранении бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Удалить это бронирование?')) {
      setLoading(true);
      try {
        await bookingsAPI.deleteBooking(id, selectedApartment);
        await loadBookings();
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert('Ошибка при удалении бронирования');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendReport = (booking: BookingRecord) => {
    if (!booking.guestEmail) {
      alert('Не указан email гостя');
      return;
    }
    
    const subject = `Отчет по бронированию ${booking.checkIn} - ${booking.checkOut}`;
    const body = `Здравствуйте, ${booking.guestName || 'Уважаемый гость'}!

Направляем вам отчет по бронированию:

Период: ${booking.checkIn} - ${booking.checkOut}
Сумма проживания: ${booking.accommodationAmount.toLocaleString('ru')} ₽
Итоговая сумма: ${booking.totalAmount.toLocaleString('ru')} ₽
${booking.earlyCheckIn > 0 ? `Ранний заезд: ${booking.earlyCheckIn.toLocaleString('ru')} ₽\n` : ''}${booking.lateCheckOut > 0 ? `Поздний выезд: ${booking.lateCheckOut.toLocaleString('ru')} ₽\n` : ''}${booking.parking > 0 ? `Паркинг: ${booking.parking.toLocaleString('ru')} ₽\n` : ''}
С уважением,
Premium Apartments`;

    window.location.href = `mailto:${booking.guestEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
                <p className="text-sm text-gray-400 font-inter">Поклонная 9</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={selectedApartment}
                onChange={(e) => setSelectedApartment(e.target.value)}
                className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 font-inter"
              >
                {APARTMENTS.map(apt => (
                  <option key={apt.id} value={apt.id}>{apt.name}</option>
                ))}
              </select>
              <FizzyButton
                onClick={() => window.location.href = '/owners'}
                variant="secondary"
                icon={<Icon name="Users" size={18} />}
              >
                Собственники
              </FizzyButton>
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
          onSendReport={handleSendReport}
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