import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id?: string;
  apartment?: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price?: number;
  total_amount?: number;
}

interface BookingCardProps {
  booking: Booking;
  formatDate: (dateStr: string) => string;
}

const BookingCard = ({ booking, formatDate }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидание';
      case 'completed':
        return 'Завершено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'completed':
        return 'CheckCircle2';
      case 'cancelled':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon name="Home" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">
                {booking.apartment || `Апартаменты #${booking.apartment_id}`}
              </h3>
              <p className="text-xs sm:text-sm text-white/60">ID: {booking.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <Icon name="Calendar" className="text-gold-400 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white/60 text-xs">Заезд</p>
                <p className="text-white text-xs sm:text-sm font-medium break-words">{formatDate(booking.check_in)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="CalendarCheck" className="text-gold-400 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white/60 text-xs">Выезд</p>
                <p className="text-white text-xs sm:text-sm font-medium break-words">{formatDate(booking.check_out)}</p>
              </div>
            </div>
          </div>

          {(booking.total_price || booking.total_amount) && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Icon name="Banknote" className="text-gold-400 w-4 h-4 sm:w-5 sm:h-5" />
              <div>
                <p className="text-white/60 text-xs">Сумма</p>
                <p className="text-white text-sm sm:text-base font-bold">
                  {((booking.total_price || booking.total_amount || 0) / 100).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border ${getStatusColor(booking.status)} flex items-center gap-2 self-start sm:self-auto`}>
          <Icon name={getStatusIcon(booking.status) as any} className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{getStatusText(booking.status)}</span>
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
