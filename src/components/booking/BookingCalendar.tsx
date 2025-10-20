import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BookingCalendarProps {
  roomId: string;
  roomName: string;
  pricePerNight: number;
  onClose?: () => void;
}

interface DayData {
  date: string;
  available: boolean;
  price: number;
  booked: boolean;
}

const BookingCalendar = ({ roomId, roomName, pricePerNight, onClose }: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendar, setCalendar] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const { toast } = useToast();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const loadCalendar = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/76c58b68-2c97-40a0-96b0-e94d934c808f?room_id=${roomId}&month=${currentMonth}&year=${currentYear}`
      );
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки календаря');
      }

      const data = await response.json();
      setCalendar(data.calendar || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить календарь доступности',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, [currentMonth, currentYear, roomId]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: DayData) => {
    if (!day.available || day.booked) return;

    const clickedDate = new Date(day.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    if (!checkIn) {
      setCheckIn(day.date);
      setCheckOut(null);
    } else if (!checkOut) {
      const checkInDate = new Date(checkIn);
      if (clickedDate > checkInDate) {
        setCheckOut(day.date);
      } else {
        setCheckIn(day.date);
        setCheckOut(null);
      }
    } else {
      setCheckIn(day.date);
      setCheckOut(null);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return nights * pricePerNight;
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: 'Выберите даты',
        description: 'Пожалуйста, выберите даты заезда и выезда',
        variant: 'destructive'
      });
      return;
    }

    // Здесь будет логика бронирования через Bnovo API
    toast({
      title: 'Бронирование',
      description: 'Переход к оформлению бронирования...',
    });
  };

  const getDayClass = (day: DayData) => {
    const isCheckIn = checkIn === day.date;
    const isCheckOut = checkOut === day.date;
    const isInRange = checkIn && checkOut && day.date > checkIn && day.date < checkOut;

    if (!day.available || day.booked) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    if (isCheckIn || isCheckOut) {
      return 'bg-gold-500 text-white font-bold cursor-pointer hover:bg-gold-600';
    }

    if (isInRange) {
      return 'bg-gold-100 text-charcoal-900 cursor-pointer hover:bg-gold-200';
    }

    return 'bg-white hover:bg-gold-50 cursor-pointer border border-gray-200';
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    
    // Пустые ячейки до первого дня месяца
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Дни месяца
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = calendar.find(d => d.date === dateStr);

      if (dayData) {
        days.push(
          <div
            key={dateStr}
            onClick={() => handleDayClick(dayData)}
            className={`p-2 rounded-lg text-center transition-all ${getDayClass(dayData)}`}
          >
            <div className="font-medium">{i}</div>
            {dayData.available && !dayData.booked && (
              <div className="text-xs mt-1 text-gray-600">{dayData.price.toLocaleString()}₽</div>
            )}
          </div>
        );
      } else {
        days.push(
          <div key={dateStr} className="p-2 bg-gray-50 rounded-lg text-center text-gray-400">
            {i}
          </div>
        );
      }
    }

    return days;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-gold-500 to-gold-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">{roomName}</h2>
            <p className="text-gold-100">Выберите даты проживания</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>

        <div className="p-6">
          {/* Управление месяцем */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevMonth}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-semibold text-charcoal-900">
              {monthNames[currentMonth - 1]} {currentYear}
            </h3>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextMonth}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
              <div key={day} className="text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Календарь */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2 mb-6">
              {renderCalendar()}
            </div>
          )}

          {/* Информация о бронировании */}
          <div className="bg-gradient-to-br from-charcoal-50 to-white rounded-xl p-6 border border-gold-200">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Заезд</label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <span className="font-medium">
                    {checkIn ? new Date(checkIn).toLocaleDateString('ru-RU') : 'Не выбрано'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Выезд</label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Calendar className="w-5 h-5 text-gold-500" />
                  <span className="font-medium">
                    {checkOut ? new Date(checkOut).toLocaleDateString('ru-RU') : 'Не выбрано'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Гостей</label>
                <div className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <Users className="w-5 h-5 text-gold-500" />
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {checkIn && checkOut && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    {Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} ночей × {pricePerNight.toLocaleString()}₽
                  </span>
                  <span className="font-semibold">{calculateTotal().toLocaleString()}₽</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Итого:</span>
                  <span className="font-bold text-2xl text-gold-600">{calculateTotal().toLocaleString()}₽</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleBooking}
              disabled={!checkIn || !checkOut}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white font-semibold py-6 rounded-xl text-lg"
            >
              Забронировать
            </Button>
          </div>

          <div className="mt-4 flex items-start gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gold-500 rounded"></div>
              <span>Выбрано</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gold-100 rounded"></div>
              <span>Диапазон</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Занято</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;