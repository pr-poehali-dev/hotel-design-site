import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Icon from '@/components/ui/icon';
import Header from '@/components/sections/Header';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  addMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay,
  differenceInDays
} from 'date-fns';
import { ru } from 'date-fns/locale';

interface AvailabilityDay {
  date: string;
  is_available: boolean;
  price?: number;
}

interface Calendar {
  room_id: string;
  room_name: string;
  days: AvailabilityDay[];
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [adults, setAdults] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!roomId) {
      window.location.href = '/';
      return;
    }

    const fetchCalendar = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/cb06df00-bb06-4e01-a02d-f31057ae60af`);
        const data = await response.json();
        console.log('Все календари:', data.calendars);
        console.log('Ищем roomId:', roomId);
        const roomCalendar = data.calendars.find((cal: Calendar) => cal.room_id === roomId);
        console.log('Найденный календарь:', roomCalendar);
        
        if (roomCalendar) {
          setCalendar(roomCalendar);
        } else {
          console.error('Календарь для данного апартамента не найден');
          console.log('Доступные room_id:', data.calendars.map((c: Calendar) => c.room_id));
        }
      } catch (error) {
        console.error('Ошибка загрузки календаря:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [roomId]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: ru });
  const calendarEnd = endOfWeek(monthEnd, { locale: ru });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const isDateAvailable = (date: Date): boolean => {
    if (!calendar) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendar.days.find(d => d.date === dateStr);
    // Если дня нет в календаре - он свободен, если есть - проверяем is_available
    return dayData ? dayData.is_available : true;
  };

  const handleDateClick = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return;
    if (!isDateAvailable(date)) return;

    if (!checkInDate) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (!checkOutDate) {
      if (isBefore(date, checkInDate)) {
        setCheckInDate(date);
        setCheckOutDate(null);
      } else {
        const allAvailable = eachDayOfInterval({ start: checkInDate, end: date })
          .every(d => isDateAvailable(d));
        
        if (allAvailable) {
          setCheckOutDate(date);
        } else {
          setCheckInDate(date);
          setCheckOutDate(null);
        }
      }
    } else {
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const getDayCellStyle = (day: Date) => {
    const today = startOfDay(new Date());
    const isPast = isBefore(day, today);
    const isAvailable = isDateAvailable(day);
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    const isToday = isSameDay(day, today);
    
    let isSelected = false;
    let isInRange = false;

    if (checkInDate && isSameDay(day, checkInDate)) isSelected = true;
    if (checkOutDate && isSameDay(day, checkOutDate)) isSelected = true;
    if (checkInDate && checkOutDate && isWithinInterval(day, { start: checkInDate, end: checkOutDate })) {
      isInRange = true;
    }

    let bgColor = 'bg-charcoal-800/30';
    if (isPast) bgColor = 'bg-charcoal-900/50 cursor-not-allowed';
    else if (!isAvailable) bgColor = 'bg-red-900/20 cursor-not-allowed';
    else if (isSelected) bgColor = 'bg-gold-500 text-white';
    else if (isInRange) bgColor = 'bg-gold-500/30';
    else if (isAvailable) bgColor = 'bg-green-500/20 hover:bg-green-500/30 cursor-pointer';

    return `
      min-h-[60px] p-2 rounded transition-all
      ${bgColor}
      ${!isCurrentMonth ? 'opacity-30' : ''}
      ${isToday ? 'ring-2 ring-blue-500' : ''}
    `;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) return;

    setSubmitting(true);
    try {
      const response = await fetch('https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: roomId,
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          check_in: format(checkInDate, 'yyyy-MM-dd'),
          check_out: format(checkOutDate, 'yyyy-MM-dd'),
          total_amount: 0,
          aggregator_commission: 0
        })
      });

      if (response.ok) {
        alert('Бронирование успешно создано! Апартамент забронирован на выбранные даты.');
        window.location.href = '/';
      } else {
        const error = await response.json();
        console.error('Ошибка от сервера:', error);
        alert(`Ошибка: ${error.error || 'Не удалось создать бронирование'}`);
      }
    } catch (error) {
      console.error('Ошибка создания бронирования:', error);
      alert('Ошибка создания бронирования. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalNights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl text-white mb-4">Апартамент не найден</h1>
          <Button onClick={() => window.location.href = '/'}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="mb-4 bg-charcoal-800 border-gold-500/20 text-white hover:bg-charcoal-700"
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Бронирование апартамента
            </h1>
            <p className="text-gray-400">{calendar.room_name}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-charcoal-800/50 border-gold-500/20">
              <h2 className="text-xl font-bold text-gold-400 mb-4">
                Выберите даты
              </h2>

              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                  variant="outline"
                  size="sm"
                  className="bg-charcoal-800 border-gold-500/20 hover:bg-charcoal-700"
                >
                  <Icon name="ChevronLeft" size={20} className="text-white" />
                </Button>
                <h3 className="text-lg font-bold text-white">
                  {format(currentMonth, 'LLLL yyyy', { locale: ru })}
                </h3>
                <Button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  variant="outline"
                  size="sm"
                  className="bg-charcoal-800 border-gold-500/20 hover:bg-charcoal-700"
                >
                  <Icon name="ChevronRight" size={20} className="text-white" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleDateClick(day)}
                    className={getDayCellStyle(day)}
                  >
                    <div className="text-sm text-white font-medium">
                      {format(day, 'd')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/20 rounded"></div>
                  <span className="text-gray-400">Доступно</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-900/20 rounded"></div>
                  <span className="text-gray-400">Занято</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gold-500 rounded"></div>
                  <span className="text-gray-400">Выбрано</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-charcoal-800/50 border-gold-500/20">
              <h2 className="text-xl font-bold text-gold-400 mb-4">
                Детали бронирования
              </h2>

              {checkInDate && checkOutDate ? (
                <div className="mb-6 p-4 bg-charcoal-900/50 rounded-lg">
                  <div className="flex justify-between text-white mb-2">
                    <span>Заезд:</span>
                    <span className="font-semibold">{format(checkInDate, 'dd MMM yyyy', { locale: ru })}</span>
                  </div>
                  <div className="flex justify-between text-white mb-2">
                    <span>Выезд:</span>
                    <span className="font-semibold">{format(checkOutDate, 'dd MMM yyyy', { locale: ru })}</span>
                  </div>
                  <div className="flex justify-between text-gold-400 font-bold">
                    <span>Ночей:</span>
                    <span>{totalNights}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-charcoal-900/50 rounded-lg text-center text-gray-400">
                  Выберите даты заезда и выезда
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Количество гостей
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold"
                  disabled={!checkInDate || !checkOutDate || submitting}
                >
                  <Icon name="Calendar" size={18} className="mr-2" />
                  {submitting ? 'Отправка...' : 'Забронировать'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}