import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
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

interface Booking {
  id: string;
  apartment_id: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  aggregator_commission?: number;
}

interface Apartment {
  apartmentId: string;
  ownerName: string;
  commissionRate: number;
}

interface BookingCalendarProps {
  bookings: Booking[];
  apartments: Apartment[];
  onDateClick?: (date: Date, apartmentId: string) => void;
  onBookingClick?: (booking: Booking) => void;
}

export default function BookingCalendar({ 
  bookings, 
  apartments,
  onDateClick,
  onBookingClick 
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedApartment, setSelectedApartment] = useState<string>('all');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const filteredApartments = useMemo(() => {
    if (selectedApartment === 'all') return apartments;
    return apartments.filter(apt => apt.apartmentId === selectedApartment);
  }, [apartments, selectedApartment]);

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
      return 'bg-blue-600/40';
    }
    
    return 'bg-green-600/40';
  };

  return (
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
                          onBookingClick?.(bookingsForDay[0]);
                        } else {
                          onDateClick?.(day, apartment.apartmentId);
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

        <div className="flex items-center gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600/40 rounded"></div>
            <span className="text-sm text-slate-300">Предстоящие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/20 border border-green-500/40 rounded"></div>
            <span className="text-sm text-slate-300">Текущие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500/20 border border-gray-500/40 rounded"></div>
            <span className="text-sm text-slate-300">Прошедшие</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/5 border border-white/20 rounded"></div>
            <span className="text-sm text-slate-300">Свободно</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 ring-2 ring-blue-500 rounded"></div>
            <span className="text-sm text-slate-300">Сегодня</span>
          </div>
        </div>
      </div>
    </Card>
  );
}