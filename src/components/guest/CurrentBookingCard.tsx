import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  status?: string;
}

interface CurrentBookingCardProps {
  booking: Booking;
  formatDate: (dateStr: string) => string;
  daysUntil: number;
  downloadingPdf: string | null;
  onDownloadPdf: (bookingId: string) => void;
  cancellingBooking: string | null;
  onCancelBooking: (bookingId: string) => void;
}

const CurrentBookingCard = ({ 
  booking, 
  formatDate, 
  daysUntil,
  downloadingPdf,
  onDownloadPdf,
  cancellingBooking,
  onCancelBooking
}: CurrentBookingCardProps) => {
  const isCancelled = booking.status === 'cancelled';
  const canCancel = daysUntil > 0 && !isCancelled;
  return (
    <Card className={`border-t-4 shadow-lg ${isCancelled ? 'border-t-red-500 opacity-75' : 'border-t-gold-500'}`}>
      <CardHeader className="pb-3 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg md:text-2xl font-playfair">Ваше бронирование</CardTitle>
          {isCancelled ? (
            <Badge className="bg-red-500 text-white text-xs md:text-sm w-fit">Отменено</Badge>
          ) : (
            <>
              {daysUntil > 0 && (
                <Badge className="bg-gold-500 text-white text-xs md:text-sm w-fit">
                  Заезд через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
                </Badge>
              )}
              {daysUntil === 0 && (
                <Badge className="bg-green-500 text-white text-xs md:text-sm w-fit">Заезд сегодня!</Badge>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-3 md:p-4 rounded-lg border border-gray-100">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Calendar" size={16} className="mr-2 md:w-[18px] md:h-[18px]" />
              <span className="font-semibold text-sm md:text-base">Заезд</span>
            </div>
            <p className="text-base md:text-lg font-bold text-charcoal-900">{formatDate(booking.check_in)}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white p-3 md:p-4 rounded-lg border border-gray-100">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Calendar" size={16} className="mr-2 md:w-[18px] md:h-[18px]" />
              <span className="font-semibold text-sm md:text-base">Выезд</span>
            </div>
            <p className="text-base md:text-lg font-bold text-charcoal-900">{formatDate(booking.check_out)}</p>
          </div>
          <div className="bg-gradient-to-br from-gold-50 to-white p-3 md:p-4 rounded-lg border border-gold-200">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Home" size={16} className="mr-2 md:w-[18px] md:h-[18px]" />
              <span className="font-semibold text-sm md:text-base">Апартамент</span>
            </div>
            <p className="text-base md:text-lg font-bold text-gold-600">№ {booking.apartment_id}</p>
          </div>
        </div>
        <div className="pt-3 md:pt-4 border-t flex flex-col sm:flex-row sm:justify-between gap-2 md:gap-3">
          {canCancel && (
            <button
              onClick={() => onCancelBooking(booking.id)}
              disabled={cancellingBooking === booking.id}
              className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm md:text-base transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              {cancellingBooking === booking.id ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin md:w-[18px] md:h-[18px]" />
                  <span className="text-sm md:text-base">Отмена...</span>
                </>
              ) : (
                <>
                  <Icon name="XCircle" size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="text-sm md:text-base">Отменить</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onDownloadPdf(booking.id)}
            disabled={downloadingPdf === booking.id}
            className="inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-lg font-semibold text-sm md:text-base transition-all disabled:opacity-50 shadow-lg w-full sm:w-auto"
          >
            {downloadingPdf === booking.id ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin md:w-[18px] md:h-[18px]" />
                <span>Генерация...</span>
              </>
            ) : (
              <>
                <Icon name="Download" size={16} className="md:w-[18px] md:h-[18px]" />
                <span>Скачать подтверждение</span>
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentBookingCard;