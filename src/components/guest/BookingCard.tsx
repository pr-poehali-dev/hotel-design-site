import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id: string;
  apartment_name?: string;
  room_number?: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

interface BookingCardProps {
  booking: Booking;
  status: 'active' | 'upcoming' | 'completed';
  daysUntil?: number;
  formatDate: (dateStr: string) => string;
}

export default function BookingCard({ booking, status, daysUntil, formatDate }: BookingCardProps) {
  const getNights = () => {
    return Math.ceil(
      (new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6 hover:bg-white/15 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {booking.apartment_name || booking.room_number || `Апартамент ${booking.apartment_id}`}
          </h3>
          {status === 'active' ? (
            <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
              <Icon name="CheckCircle" size={12} className="mr-1" />
              Активная бронь
            </span>
          ) : daysUntil !== undefined && daysUntil <= 7 ? (
            <span className="inline-flex items-center px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
              <Icon name="Clock" size={12} className="mr-1" />
              Через {daysUntil} {daysUntil === 1 ? 'день' : 'дней'}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
              <Icon name="Calendar" size={12} className="mr-1" />
              Предстоящая
            </span>
          )}
        </div>
        {booking.total_amount && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{booking.total_amount.toLocaleString()} ₽</div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-white/80">
          <Icon name="Calendar" size={16} className="mr-2 text-purple-400" />
          <span className="text-sm">
            {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
          </span>
        </div>

        <div className="flex items-center text-white/80">
          <Icon name="Clock" size={16} className="mr-2 text-purple-400" />
          <span className="text-sm">{getNights()} ночей</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
        <Button 
          size="sm" 
          className="flex-1 bg-purple-600 hover:bg-purple-700"
          onClick={() => window.open(`https://reservationsteps.ru/`, '_blank')}
        >
          <Icon name="ExternalLink" size={14} />
          Детали брони
        </Button>
        {status === 'upcoming' && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <Icon name="RotateCcw" size={14} />
            Повторить
          </Button>
        )}
      </div>
    </Card>
  );
}
