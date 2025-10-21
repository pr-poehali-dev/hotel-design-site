import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import BnovoSyncButton from '@/components/admin/BnovoSyncButton';
import BnovoSyncSettings from '@/components/admin/BnovoSyncSettings';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const AUTH_KEY = 'premium_apartments_admin_auth';

const APARTMENT_NAMES: Record<string, string> = {
  '1116': 'Поклонная 9 - 3х комнатный Gold Suite',
  '816': 'Поклонная 9 - 3х комнатный Panorama Suite',
  '2019': 'Поклонная 9 - 2х комнатный Aurora',
  '2111': 'Поклонная 9 - 3х комнатный Family Joy',
  '2110': 'Поклонная 9 - 3х комнатный Fireplace Luxury',
  '1401': 'Поклонная 9 - 2х комнатный Mirror Studio',
  '2119': 'Поклонная 9 - 2х комнатный Bearbrick Studio',
  '2817': 'Поклонная 9 - 3х комнатный Cozy Corner',
  '1311': 'Поклонная 9 - 2х комнатный Vista Point',
  '906': 'Поклонная 9 - 2х комнатный Cyber Space',
  '133': 'Поклонная 9-133',
  '1522': 'Поклонная 9-1522',
  '1157': 'Апартамент студия Матч Поинт',
  '193': 'Энитэо-193'
};

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
  guests_count?: number;
  owner_funds?: number;
  aggregator_commission?: number;
  our_commission?: number;
}

export default function CalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showOnlyVisible, setShowOnlyVisible] = useState(false);

  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date);
    }
    return months;
  };

  const monthOptions = generateMonthOptions();
  const currentMonth = selectedMonth.toLocaleDateString('ru', { month: 'long', year: 'numeric' });
  const isCurrentMonth = selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear();

  const filteredBookings = bookings.filter(b => {
    const checkIn = new Date(b.check_in);
    const matchesMonth = checkIn.getMonth() === selectedMonth.getMonth() && checkIn.getFullYear() === selectedMonth.getFullYear();
    const matchesApartment = selectedApartment === 'all' || b.apartment_id === selectedApartment;
    const matchesVisibility = !showOnlyVisible || b.show_to_guest;
    return matchesMonth && matchesApartment && matchesVisibility;
  });

  const uniqueApartments = Array.from(new Set(bookings.map(b => b.apartment_id))).sort();

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

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
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

  const getApartmentName = (apartmentId: string) => {
    return APARTMENT_NAMES[apartmentId] || `Апартамент ${apartmentId}`;
  };

  const totalAmount = filteredBookings.reduce((sum, b) => sum + (b.owner_funds || 0), 0);
  const paidAmount = filteredBookings.filter(b => b.is_prepaid).reduce((sum, b) => sum + (b.owner_funds || 0), 0);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="bg-charcoal-900 border-b border-gold-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-charcoal-900">P9</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Календарь бронирований</h1>
                <p className="text-xs text-gray-400">Управление бронированиями из Бново</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BnovoSyncButton onSyncComplete={loadBookings} />
              <button onClick={handleLogout} className="p-2 hover:bg-charcoal-800 rounded-lg">
                <Icon name="LogOut" size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <BnovoSyncSettings />

        <div className="mb-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Calendar" size={20} className="text-gold-500" />
            <span className="text-white font-semibold">Выбор периода</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {monthOptions.map((month, index) => {
              const isSelected = month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear();
              const isCurrent = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear();
              const label = month.toLocaleDateString('ru', { month: 'short', year: 'numeric' });

              return (
                <button
                  key={index}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-gold-500 text-charcoal-900 font-semibold'
                      : 'bg-charcoal-800 text-gray-400 hover:bg-charcoal-700'
                  }`}
                >
                  {label}
                  {isCurrent && isSelected && (
                    <span className="ml-1 text-xs">●</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <select
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            className="bg-charcoal-800 border border-gold-500/20 text-white rounded-lg px-4 py-2"
          >
            <option value="all">Все апартаменты</option>
            {uniqueApartments.map(aptId => (
              <option key={aptId} value={aptId}>
                {getApartmentName(aptId)}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowOnlyVisible(!showOnlyVisible)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showOnlyVisible
                ? 'bg-gold-500 text-charcoal-900 font-semibold'
                : 'bg-charcoal-800 text-gray-400 hover:bg-charcoal-700'
            }`}
          >
            {showOnlyVisible ? 'Показать все' : 'Только видимые владельцам'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gold-500 to-gold-600 border-0 p-6">
            <div className="text-center">
              <p className="text-sm text-charcoal-900/80 mb-2">Итого к получению владельцам</p>
              <p className="text-3xl font-bold text-charcoal-900">{totalAmount.toLocaleString('ru')} ₽</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 p-6">
            <div className="text-center">
              <p className="text-sm text-white/80 mb-2">Уже оплачено</p>
              <p className="text-3xl font-bold text-white">{paidAmount.toLocaleString('ru')} ₽</p>
            </div>
          </Card>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-white">Бронирования за {currentMonth}</h2>
            {isCurrentMonth && (
              <span className="text-xs bg-gold-500/20 text-gold-500 px-2 py-1 rounded-full">Текущий период</span>
            )}
            <span className="text-xs bg-charcoal-800 text-gray-400 px-2 py-1 rounded-full">
              {filteredBookings.length} шт.
            </span>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Загрузка бронирований...</p>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Нет бронирований за выбранный период</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className={`p-4 cursor-pointer hover:bg-charcoal-800/70 transition-colors ${
                    !booking.show_to_guest ? 'opacity-50 border-red-500/30' : ''
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{booking.guest_name || 'Гость'}</p>
                        {!booking.show_to_guest && (
                          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Скрыто</span>
                        )}
                        {booking.bnovo_id && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Бново</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {getApartmentName(booking.apartment_id)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {format(new Date(booking.check_in), 'dd.MM.yyyy', { locale: ru })} - {format(new Date(booking.check_out), 'dd.MM.yyyy', { locale: ru })}
                      </p>
                      {booking.guests_count && (
                        <p className="text-xs text-gray-500 mt-1">
                          Гостей: {booking.guests_count}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold-500">{(booking.owner_funds || 0).toLocaleString('ru')} ₽</p>
                      <p className="text-xs text-gray-400">Всего: {booking.total_amount?.toLocaleString('ru')} ₽</p>
                      {booking.is_prepaid && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full mt-1 inline-block">Оплачено</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

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
                  <p className="text-white font-semibold">{getApartmentName(selectedBooking.apartment_id)}</p>
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
                  <p className="text-sm text-gray-400">Сумма владельцу</p>
                  <p className="text-white font-semibold">{(selectedBooking.owner_funds || 0).toLocaleString('ru')} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Общая сумма</p>
                  <p className="text-white font-semibold">{selectedBooking.total_amount?.toLocaleString('ru')} ₽</p>
                </div>
                {selectedBooking.aggregator_commission !== undefined && (
                  <div>
                    <p className="text-sm text-gray-400">Комиссия агрегатора</p>
                    <p className="text-white font-semibold">{selectedBooking.aggregator_commission?.toLocaleString('ru')} ₽</p>
                  </div>
                )}
                {selectedBooking.our_commission !== undefined && (
                  <div>
                    <p className="text-sm text-gray-400">Наша комиссия</p>
                    <p className="text-white font-semibold">{selectedBooking.our_commission?.toLocaleString('ru')} ₽</p>
                  </div>
                )}
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
  );
}