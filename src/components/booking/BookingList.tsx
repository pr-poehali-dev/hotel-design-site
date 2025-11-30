import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
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

interface BookingListProps {
  calendar: Calendar;
}

export default function BookingList({ calendar }: BookingListProps) {
  if (!calendar || !calendar.days.some(d => !d.is_available && d.guest_name)) {
    return null;
  }

  return (
    <Card className="p-6 bg-charcoal-800/50 border-gold-500/20 mt-6">
      <h2 className="text-xl font-bold text-gold-400 mb-4 flex items-center gap-2">
        <Icon name="Users" size={20} />
        Текущие бронирования
      </h2>
      <div className="space-y-3">
        {Array.from(new Map(
          calendar.days
            .filter(d => !d.is_available && d.guest_name)
            .map(d => [d.booking_id, d])
        ).values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((booking, idx) => {
            const bookingDays = calendar.days.filter(
              d => d.booking_id === booking.booking_id && !d.is_available
            );
            const checkIn = bookingDays[0].date;
            const checkOut = bookingDays[bookingDays.length - 1].date;
            
            return (
              <div 
                key={booking.booking_id || idx}
                className="p-4 bg-charcoal-900/50 rounded-lg border border-red-500/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="User" size={16} className="text-gold-400" />
                      <span className="text-white font-semibold">
                        {booking.guest_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Icon name="Calendar" size={14} />
                      <span>
                        {format(new Date(checkIn), 'dd MMM', { locale: ru })} - {format(new Date(checkOut), 'dd MMM yyyy', { locale: ru })}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span>{bookingDays.length} {bookingDays.length === 1 ? 'ночь' : bookingDays.length < 5 ? 'ночи' : 'ночей'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-red-400 text-sm">
                    <Icon name="X" size={14} />
                    <span>Занято</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Card>
  );
}
