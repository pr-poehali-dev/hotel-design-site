import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';

interface MonthCalendarProps {
  selectedApartment: string;
  availability: { [apartmentId: string]: { [date: string]: { available: boolean; price?: number } } };
  onDateSelect: (date: string) => void;
  selectedDates: { checkIn: string; checkOut: string };
}

const MonthCalendar = ({ selectedApartment, availability, onDateSelect, selectedDates }: MonthCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  console.log('📅 MonthCalendar rendered');
  console.log('  Selected apartment:', selectedApartment);
  console.log('  Availability keys:', Object.keys(availability));
  console.log('  Availability for selected:', availability[selectedApartment]);

  const isDateDisabled = (date: Date) => {
    if (!selectedApartment) {
      console.log('🔴 No apartment selected');
      return false;
    }
    const dateStr = date.toISOString().split('T')[0];
    const aptAvailability = availability[selectedApartment];
    
    if (!aptAvailability) {
      console.log(`🔴 No availability data for apartment ${selectedApartment}. Available apartments:`, Object.keys(availability));
      return false;
    }
    
    const isUnavailable = aptAvailability[dateStr]?.available === false;
    if (isUnavailable) {
      console.log(`🔴 Date ${dateStr} is unavailable for apartment ${selectedApartment}`);
    }
    return isUnavailable;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (!selectedDates.checkIn && !selectedDates.checkOut) return false;
    
    if (selectedDates.checkIn && selectedDates.checkOut) {
      return dateStr >= selectedDates.checkIn && dateStr <= selectedDates.checkOut;
    }
    return dateStr === selectedDates.checkIn;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return false;
    const dateStr = date.toISOString().split('T')[0];
    return dateStr > selectedDates.checkIn && dateStr < selectedDates.checkOut;
  };

  const handleDateClick = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;
    if (isDateDisabled(date)) return;
    
    const dateStr = date.toISOString().split('T')[0];
    onDateSelect(dateStr);
  };

  const getDaysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(new Date(year, month, -i));
    }
    days.reverse();

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
      }
    }

    return days;
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const monthName = currentMonth.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg border border-charcoal-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-charcoal-100 rounded-lg transition-colors"
          type="button"
        >
          <Icon name="ChevronLeft" size={20} />
        </button>
        <h3 className="text-lg font-semibold text-charcoal-900 capitalize">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-charcoal-100 rounded-lg transition-colors"
          type="button"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-charcoal-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
          const disabled = isDateDisabled(date) || isPast;
          const selected = isDateSelected(date);
          const inRange = isDateInRange(date);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              type="button"
              className={`
                aspect-square p-1 text-sm rounded-lg transition-all
                ${!isCurrentMonth ? 'text-charcoal-300' : 'text-charcoal-900'}
                ${disabled ? 'bg-red-50 text-red-400 cursor-not-allowed line-through' : 'hover:bg-gold-100'}
                ${selected && selectedDates.checkIn === date.toISOString().split('T')[0] ? 'bg-gold-500 text-white font-bold' : ''}
                ${selected && selectedDates.checkOut === date.toISOString().split('T')[0] ? 'bg-gold-500 text-white font-bold' : ''}
                ${inRange ? 'bg-gold-100' : ''}
                ${isToday && !selected ? 'border-2 border-gold-500' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{date.getDate()}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gold-500 rounded"></div>
          <span className="text-charcoal-600">Выбрано</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gold-100 rounded"></div>
          <span className="text-charcoal-600">Период</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-50 rounded line-through"></div>
          <span className="text-charcoal-600">Занято</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-gold-500 rounded"></div>
          <span className="text-charcoal-600">Сегодня</span>
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;