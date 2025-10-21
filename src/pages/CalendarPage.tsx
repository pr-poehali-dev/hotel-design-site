import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import BnovoSyncButton from '@/components/admin/BnovoSyncButton';
import BnovoSyncSettings from '@/components/admin/BnovoSyncSettings';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay
} from 'date-fns';
import { ru } from 'date-fns/locale';

const AUTH_KEY = 'premium_apartments_admin_auth';

interface Booking {
  id: string;
  apartment_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  is_prepaid?: boolean;
  show_to_guest?: boolean;
  bnovo_id?: string;
}

interface Apartment {
  apartmentId: string;
  ownerName: string;
  commissionRate: number;
}

export default function CalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const filteredApartments = selectedApartment === 'all' 
    ? apartments 
    : apartments.filter(apt => apt.apartmentId === selectedApartment);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e');
      if (response.ok) {
        const data = await response.json();
        setBookings(data || []);
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
        setApartments(data || []);
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

  const getBookingsForDay = (day: Date, apartmentId: string) => {
    return bookings.filter(booking => {
      if (booking.apartment_id !== apartmentId) return false;
      
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      
      return isWithinInterval(day, { start: checkIn, end: checkOut }) ||
             isSameDay(day, checkIn) ||
             isSameDay(day, checkOut);
    });
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const getCellColor = (bookingsForDay: Booking[], day: Date) => {
    if (bookingsForDay.length === 0) return 'bg-white/5 hover:bg-white/10';
    
    const today = startOfDay(new Date());
    const isPast = isBefore(day, today);
    
    if (isPast) {
      return 'bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/40';
    }
    
    return 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/40';
  };

  const getBookingBadgeColor = (booking: Booking, day: Date) => {
    const today = startOfDay(new Date());
    const checkIn = startOfDay(new Date(booking.check_in));
    const isPast = isBefore(day, today);
    const isUpcoming = !isBefore(checkIn, today);
    
    if (isPast) {
      return 'bg-gray-600/40';
    }
    
    if (isUpcoming) {
      if (booking.is_prepaid) {
        return 'bg-emerald-600/50 border border-emerald-400/30';
      }
      return 'bg-orange-600/50 border border-orange-400/30';
    }
    
    return 'bg-green-600/40';
  };

  const handleDeleteBooking = async (booking: Booking) => {
    if (!confirm(`Удалить бронирование ${booking.guest_name}?`)) return;
    
    try {
      const response = await fetch(
        `https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9?method=DELETE&id=${booking.id}&apartment_id=${booking.apartment_id}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        setSelectedBooking(null);
        await loadBookings();
      } else {
        alert('Ошибка при удалении бронирования');
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Ошибка при удалении бронирования');
    }
  };

  const handleToggleVisibility = async (booking: Booking) => {
    try {
      const response = await fetch('https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: booking.id,
          apartment_id: booking.apartment_id,
          show_to_guest: !booking.show_to_guest
        })
      });
      
      if (response.ok) {
        await loadBookings();
        setSelectedBooking(prev => prev ? { ...prev, show_to_guest: !prev.show_to_guest } : null);
      } else {
        alert('Ошибка при обновлении бронирования');
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Ошибка при обновлении бронирования');
    }
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
            <p className="text-slate-300">Управление бронированиями из Бново</p>
          </div>
          <div className="flex items-center gap-2">
            <BnovoSyncButton onSyncComplete={loadBookings} />
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

        <BnovoSyncSettings />

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button onClick={handlePrevMonth} variant="outline" size="sm">
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                <h2 className="text-2xl font-bold text-white min-w-[200px] text-center">
                  {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                </h2>
                <Button onClick={handleNextMonth} variant="outline" size="sm">
                  <Icon name="ChevronRight" size={16} />
                </Button>
                <Button onClick={handleToday} variant="outline" size="sm">
                  Сегодня
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedApartment}
                  onChange={(e) => setSelectedApartment(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">Все апартаменты</option>
                  {apartments.map(apt => (
                    <option key={apt.apartmentId} value={apt.apartmentId}>
                      {apt.apartmentId}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Загрузка бронирований...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApartments.map(apartment => (
                  <div key={apartment.apartmentId} className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-lg font-semibold text-white">
                        {apartment.apartmentId}
                      </h3>
                      <span className="text-sm text-slate-300">
                        {apartment.ownerName}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {weekDays.map(day => (
                        <div 
                          key={day} 
                          className="text-center text-xs font-semibold text-slate-400 py-2"
                        >
                          {day}
                        </div>
                      ))}

                      {days.map((day, idx) => {
                        const bookingsForDay = getBookingsForDay(day, apartment.apartmentId);
                        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                        const isToday = isSameDay(day, new Date());

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              if (bookingsForDay.length > 0) {
                                setSelectedBooking(bookingsForDay[0]);
                              }
                            }}
                            className={`
                              min-h-[60px] p-1 rounded cursor-pointer transition-all duration-200
                              ${getCellColor(bookingsForDay, day)}
                              ${!isCurrentMonth ? 'opacity-30' : ''}
                              ${isToday ? 'ring-2 ring-blue-500' : ''}
                            `}
                          >
                            <div className="text-xs text-white font-medium mb-1">
                              {format(day, 'd')}
                            </div>
                            {bookingsForDay.length > 0 && (
                              <div className="space-y-0.5">
                                {bookingsForDay.map(booking => (
                                  <div 
                                    key={booking.id}
                                    className={`text-[10px] text-white/90 rounded px-1 py-0.5 truncate ${getBookingBadgeColor(booking, day)}`}
                                    title={`${booking.guest_name || 'Гость'}`}
                                  >
                                    {booking.guest_name?.split(' ')[0] || 'Гость'}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t border-white/20 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-600/50 border border-emerald-400/30 rounded"></div>
                <span className="text-sm text-slate-300">Оплачено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-600/50 border border-orange-400/30 rounded"></div>
                <span className="text-sm text-slate-300">Не оплачено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600/40 rounded"></div>
                <span className="text-sm text-slate-300">Прошедшие</span>
              </div>
            </div>
          </div>
        </Card>

        {selectedBooking && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
            <Card className="bg-charcoal-900 border-gold-500/20 p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Детали бронирования</h3>
                  <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white">
                    <Icon name="X" size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Гость</p>
                    <p className="text-white font-semibold">{selectedBooking.guest_name || 'Не указано'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Апартамент</p>
                    <p className="text-white font-semibold">{selectedBooking.apartment_id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Заезд</p>
                      <p className="text-white font-semibold">
                        {format(new Date(selectedBooking.check_in), 'dd.MM.yyyy', { locale: ru })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Выезд</p>
                      <p className="text-white font-semibold">
                        {format(new Date(selectedBooking.check_out), 'dd.MM.yyyy', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Сумма</p>
                    <p className="text-white font-semibold">{selectedBooking.total_amount?.toLocaleString('ru')} ₽</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Источник</p>
                    <p className="text-white font-semibold">
                      {selectedBooking.bnovo_id ? `Бново (ID: ${selectedBooking.bnovo_id})` : 'Вручную'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Видимость для владельца</p>
                    <p className="text-white font-semibold">
                      {selectedBooking.show_to_guest ? 'Видно в отчётах' : 'Скрыто из отчётов'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/20">
                  <Button
                    onClick={() => handleToggleVisibility(selectedBooking)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Icon name={selectedBooking.show_to_guest ? 'EyeOff' : 'Eye'} size={16} />
                    {selectedBooking.show_to_guest ? 'Скрыть' : 'Показать'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteBooking(selectedBooking)}
                    variant="outline"
                    className="flex-1 text-red-400 hover:text-red-300"
                  >
                    <Icon name="Trash2" size={16} />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
