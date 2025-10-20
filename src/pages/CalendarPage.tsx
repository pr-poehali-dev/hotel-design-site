import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import BookingForm from '@/components/calendar/BookingForm';
import BookingDetailsDialog from '@/components/calendar/BookingDetailsDialog';
import AdminLogin from '@/components/AdminLogin';
import BnovoSyncButton from '@/components/admin/BnovoSyncButton';

const AUTH_KEY = 'premium_apartments_admin_auth';

interface Booking {
  id: string;
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  aggregator_commission?: number;
  is_prepaid?: boolean;
  prepayment_amount?: number;
  prepayment_date?: string;
}

interface Apartment {
  apartmentId: string;
  ownerName: string;
  commissionRate: number;
}

interface BookingFormData {
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_amount: string;
  aggregator_commission: string;
}

export default function CalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState<BookingFormData>({
    apartment_id: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    check_in: '',
    check_out: '',
    total_amount: '',
    aggregator_commission: ''
  });

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadApartments = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5');
      if (response.ok) {
        const data = await response.json();
        setApartments(data);
      }
    } catch (error) {
      console.error('Failed to load apartments:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
      loadApartments();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const handleSaveBooking = async () => {
    if (!formData.apartment_id || !formData.guest_name || !formData.check_in || !formData.check_out || !formData.total_amount) {
      alert('Заполните все обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: formData.apartment_id,
          guest_name: formData.guest_name,
          guest_email: formData.guest_email,
          guest_phone: formData.guest_phone,
          check_in: formData.check_in,
          check_out: formData.check_out,
          total_amount: parseFloat(formData.total_amount),
          aggregator_commission: formData.aggregator_commission ? parseFloat(formData.aggregator_commission) : 0
        })
      });

      if (response.ok) {
        await loadBookings();
        setIsAddingBooking(false);
        setFormData({
          apartment_id: '',
          guest_name: '',
          guest_email: '',
          guest_phone: '',
          check_in: '',
          check_out: '',
          total_amount: '',
          aggregator_commission: ''
        });
        alert('Бронирование успешно добавлено!');
      } else {
        alert('Ошибка при создании бронирования');
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert('Ошибка при создании бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setIsAddingBooking(false);
    setFormData({
      apartment_id: '',
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      check_in: '',
      check_out: '',
      total_amount: '',
      aggregator_commission: ''
    });
  };

  const handleDateClick = (date: Date, apartmentId: string) => {
    const formattedDate = date.toISOString().split('T')[0];
    setFormData({
      ...formData,
      apartment_id: apartmentId,
      check_in: formattedDate,
      check_out: formattedDate
    });
    setIsAddingBooking(true);
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(prevBookings => 
      prevBookings.map(b => b.id === updatedBooking.id ? updatedBooking : b)
    );
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Календарь бронирований</h1>
            <p className="text-slate-300">Управление бронированиями апартаментов</p>
          </div>
          <div className="flex items-center gap-2">
            <BnovoSyncButton />
            {!isAddingBooking && (
              <Button
                onClick={() => setIsAddingBooking(true)}
                className="hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Icon name="Plus" size={16} />
                Добавить бронирование
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Icon name="LogOut" size={16} />
              Выйти
            </Button>
          </div>
        </div>

        {isAddingBooking && (
          <BookingForm
            formData={formData}
            apartments={apartments}
            loading={loading}
            onSave={handleSaveBooking}
            onCancel={handleCancelBooking}
            onChange={setFormData}
          />
        )}

        <BookingCalendar
          bookings={bookings}
          apartments={apartments}
          onDateClick={handleDateClick}
          onBookingClick={handleBookingClick}
        />

        {selectedBooking && (
          <BookingDetailsDialog
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdate={handleUpdateBooking}
          />
        )}
      </div>
    </div>
  );
}