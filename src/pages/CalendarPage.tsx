import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

const AUTH_KEY = 'premium_apartments_admin_auth';

const APARTMENT_NAMES: Record<string, string> = {
  '1116': 'Поклонная 9 - 3х комнатный Gold Suite',
  '816': 'Поклонная 9 - 3х комнатный Panorama Suite',
  '2111': 'Поклонная 9 - 3х комнатный Family Joy',
  '2110': 'Поклонная 9 - 3х комнатный Fireplace Luxury',
  '1401': 'Поклонная 9 - 2х комнатный Mirror Studio',
  '2119': 'Поклонная 9 - 2х комнатный Bearbrick Studio',
  '2817': 'Поклонная 9 - 3х комнатный Cozy Corner',
  '1311': 'Поклонная 9 - 2х комнатный Vista Point',
  '906': 'Поклonная 9 - 2х комнатный Cyber Space',
  '133': 'Поклонная 9-133',
  '1522': 'Поклонная 9-1522',
  '1157': 'Апартамент студия Матч Поинт',
  '193': 'Энитэо-193'
};

interface CalendarDay {
  date: string;
  is_available: boolean;
  price?: number;
  booking_id?: string;
  guest_name?: string;
}

interface BookingDetails {
  id: string;
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  total_amount: number;
  source: string;
  status: string;
  created_at: string;
}

interface RoomCalendar {
  room_id: string;
  room_name: string;
  days: CalendarDay[];
}

export default function CalendarPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [calendars, setCalendars] = useState<RoomCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const loadCalendars = async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(addMonths(currentMonth, 2)), 'yyyy-MM-dd');
      
      const response = await fetch(
        `https://functions.poehali.dev/cb06df00-bb06-4e01-a02d-f31057ae60af?start_date=${startDate}&end_date=${endDate}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setCalendars(data.calendars || []);
      }
    } catch (error) {
      console.error('Failed to load calendars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadCalendars();
    }
  }, [isAuthenticated, currentMonth]);

  const loadBookingDetails = async (bookingId: string) => {
    setLoadingBooking(true);
    setBookingDialogOpen(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e?booking_id=${bookingId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSelectedBooking(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load booking details:', error);
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const getApartmentName = (roomId: string) => {
    return APARTMENT_NAMES[roomId] || `Апартамент ${roomId}`;
  };

  // Фильтрация календарей по выбранному апартаменту
  const filteredCalendars = selectedApartment === 'all' 
    ? calendars 
    : calendars.filter(cal => cal.room_id === selectedApartment);

  // Генерация дней для отображения (текущий месяц + 2 следующих)
  const monthsToShow = [currentMonth, addMonths(currentMonth, 1), addMonths(currentMonth, 2)];

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
                <h1 className="text-lg font-bold text-white">Календарь доступности</h1>
                <p className="text-xs text-gray-400">Календарь бронирований из Бново</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-charcoal-800 rounded-lg">
              <Icon name="LogOut" size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Выбор апартамента */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Home" size={20} className="text-gold-500" />
            <span className="text-white font-semibold">Выбор апартамента</span>
          </div>
          <select
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            className="w-full md:w-auto bg-charcoal-800 border border-gold-500/20 text-white rounded-lg px-4 py-3"
          >
            <option value="all">Все апартаменты ({calendars.length})</option>
            {calendars.map(cal => (
              <option key={cal.room_id} value={cal.room_id}>
                {cal.room_name}
              </option>
            ))}
          </select>
        </div>

        {/* Навигация по месяцам */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            variant="outline"
            className="bg-charcoal-800 border-gold-500/20 hover:bg-charcoal-700"
          >
            <Icon name="ChevronLeft" size={20} className="text-white" />
          </Button>
          <h2 className="text-xl font-bold text-white">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h2>
          <Button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            variant="outline"
            className="bg-charcoal-800 border-gold-500/20 hover:bg-charcoal-700"
          >
            <Icon name="ChevronRight" size={20} className="text-white" />
          </Button>
        </div>

        {loading ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Загрузка календарей...</p>
          </Card>
        ) : filteredCalendars.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Нет данных календаря. Попробуйте синхронизировать с Бново.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCalendars.map((calendar) => (
              <Card key={calendar.room_id} className="p-6 bg-charcoal-800/50 border-gold-500/20">
                <h3 className="text-lg font-bold text-gold-400 mb-4">
                  {calendar.room_name}
                </h3>
                
                <div className="space-y-6">
                  {monthsToShow.map((monthDate) => {
                    const monthStart = startOfMonth(monthDate);
                    const monthEnd = endOfMonth(monthDate);
                    const calendarStart = startOfWeek(monthStart, { locale: ru });
                    const calendarEnd = endOfWeek(monthEnd, { locale: ru });
                    const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                    
                    return (
                      <div key={monthDate.toISOString()} className="mb-6">
                        <h4 className="text-md font-semibold text-white mb-3">
                          {format(monthDate, 'LLLL yyyy', { locale: ru })}
                        </h4>
                        
                        {/* Заголовки дней недели */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-400 p-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        {/* Дни месяца */}
                        <div className="grid grid-cols-7 gap-1">
                          {daysInCalendar.map((day) => {
                            const dayStr = format(day, 'yyyy-MM-dd');
                            const dayData = calendar.days?.find(d => d.date === dayStr);
                            const isCurrentMonth = isSameMonth(day, monthDate);
                            const isToday = isSameDay(day, new Date());
                            
                            return (
                              <div
                                key={day.toISOString()}
                                onClick={() => {
                                  if (dayData?.booking_id) {
                                    loadBookingDetails(dayData.booking_id);
                                  }
                                }}
                                className={`
                                  p-2 text-center rounded-lg border transition-all
                                  ${!isCurrentMonth ? 'opacity-30' : ''}
                                  ${isToday ? 'ring-2 ring-gold-500' : ''}
                                  ${dayData?.is_available === false 
                                    ? 'bg-red-500/20 border-red-500/30 cursor-pointer hover:bg-red-500/30' 
                                    : 'bg-green-500/20 border-green-500/30'
                                  }
                                `}
                              >
                                <div className="text-xs font-semibold text-white">
                                  {format(day, 'd')}
                                </div>
                                {dayData?.price && (
                                  <div className="text-xs text-gray-300 mt-1">
                                    {dayData.price.toLocaleString()}₽
                                  </div>
                                )}
                                {dayData?.guest_name && (
                                  <div className="text-xs text-gold-300 mt-1 truncate" title={dayData.guest_name}>
                                    {dayData.guest_name.split(' ')[0]}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Легенда */}
        <Card className="mt-6 p-4 bg-charcoal-800/50 border-gold-500/20">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500/20 border border-green-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Доступно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500/20 border border-red-500/30 rounded"></div>
              <span className="text-sm text-gray-300">Занято (клик для деталей)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 ring-2 ring-gold-500 rounded"></div>
              <span className="text-sm text-gray-300">Сегодня</span>
            </div>
          </div>
        </Card>

        {/* Модальное окно с деталями бронирования */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-md bg-charcoal-800 border-gold-500/20">
            <DialogHeader>
              <DialogTitle className="text-gold-400">Детали бронирования</DialogTitle>
            </DialogHeader>
            
            {loadingBooking ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : selectedBooking ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">ID бронирования</p>
                    <p className="text-sm text-white font-mono break-all">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Источник</p>
                    <p className="text-sm text-white">
                      {selectedBooking.source === 'bnovo' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded">
                          <Icon name="Database" size={14} />
                          Bnovo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded">
                          <Icon name="Globe" size={14} />
                          Сайт
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs text-gray-400 mb-2">Гость</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="User" size={16} className="text-gold-400" />
                      <span className="text-white">{selectedBooking.guest_name || 'Не указано'}</span>
                    </div>
                    {selectedBooking.guest_email && (
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={16} className="text-gold-400" />
                        <a href={`mailto:${selectedBooking.guest_email}`} className="text-blue-400 hover:underline">
                          {selectedBooking.guest_email}
                        </a>
                      </div>
                    )}
                    {selectedBooking.guest_phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="Phone" size={16} className="text-gold-400" />
                        <a href={`tel:${selectedBooking.guest_phone}`} className="text-blue-400 hover:underline">
                          {selectedBooking.guest_phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs text-gray-400 mb-2">Даты проживания</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon name="CalendarArrowDown" fallback="CalendarCheck" size={16} className="text-green-400" />
                      <span className="text-white">
                        Заезд: {format(new Date(selectedBooking.check_in), 'dd MMMM yyyy', { locale: ru })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="CalendarArrowUp" fallback="CalendarX" size={16} className="text-red-400" />
                      <span className="text-white">
                        Выезд: {format(new Date(selectedBooking.check_out), 'dd MMMM yyyy', { locale: ru })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Гостей</p>
                    <p className="text-white font-semibold">{selectedBooking.guests_count || 'Не указано'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Сумма</p>
                    <p className="text-gold-400 font-bold text-lg">
                      {selectedBooking.total_amount ? `${selectedBooking.total_amount.toLocaleString('ru-RU')} ₽` : 'Не указано'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-xs text-gray-400 mb-1">Статус</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBooking.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : selectedBooking.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {selectedBooking.status === 'confirmed' ? 'Подтверждено' : 
                     selectedBooking.status === 'pending' ? 'Ожидает' : 
                     selectedBooking.status}
                  </span>
                </div>

                <div className="text-xs text-gray-500 pt-2">
                  Создано: {format(new Date(selectedBooking.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Не удалось загрузить данные
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}