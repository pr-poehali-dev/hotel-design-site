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
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfDay
} from 'date-fns';
import { ru } from 'date-fns/locale';

interface AvailabilityDay {
  date: string;
  is_available: boolean;
  price?: number;
  booking_id?: string;
  guest_name?: string;
}

interface Calendar {
  room_id: string;
  room_name: string;
  days: AvailabilityDay[];
}

interface BookingCalendarProps {
  calendar: Calendar;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  handleDateClick: (date: Date) => void;
}

export default function BookingCalendar({
  calendar,
  currentMonth,
  setCurrentMonth,
  checkInDate,
  checkOutDate,
  handleDateClick
}: BookingCalendarProps) {
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
    return dayData ? dayData.is_available : true;
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
    if (isPast) bgColor = 'bg-charcoal-900/50 cursor-not-allowed opacity-40';
    else if (!isAvailable) bgColor = 'bg-red-500/80 cursor-not-allowed relative';
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

  return (
    <Card className="p-6 bg-charcoal-800/50 border-gold-500/20">
      <h2 className="text-xl font-bold text-gold-400 mb-4">
        Выберите даты
      </h2>

      <div className="flex items-center justify-between mb-4">
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
        {days.map((day, idx) => {
          const isAvailable = isDateAvailable(day);
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayData = calendar?.days.find(d => d.date === dateStr);
          
          return (
            <div
              key={idx}
              onClick={() => handleDateClick(day)}
              className={getDayCellStyle(day)}
              title={!isAvailable && dayData?.guest_name ? `Занято: ${dayData.guest_name}` : ''}
            >
              <div className="text-sm text-white font-medium">
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500/20 rounded"></div>
          <span className="text-gray-400">Доступно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500/80 rounded"></div>
          <span className="text-gray-400">Занято</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gold-500 rounded"></div>
          <span className="text-gray-400">Выбрано</span>
        </div>
      </div>
    </Card>
  );
}