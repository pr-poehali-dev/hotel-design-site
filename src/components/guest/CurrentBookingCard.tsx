import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
}

interface CurrentBookingCardProps {
  booking: Booking;
  formatDate: (dateStr: string) => string;
  daysUntil: number;
  downloadingPdf: string | null;
  onDownloadPdf: (bookingId: string) => void;
}

const CurrentBookingCard = ({ 
  booking, 
  formatDate, 
  daysUntil,
  downloadingPdf,
  onDownloadPdf
}: CurrentBookingCardProps) => {
  return (
    <Card className="border-t-4 border-t-gold-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-playfair">Ваше бронирование</CardTitle>
          {daysUntil > 0 && (
            <Badge className="bg-gold-500 text-white">
              Заезд через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
            </Badge>
          )}
          {daysUntil === 0 && (
            <Badge className="bg-green-500 text-white">Заезд сегодня!</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Calendar" size={18} className="mr-2" />
              <span className="font-semibold">Заезд</span>
            </div>
            <p className="text-lg text-charcoal-900">{formatDate(booking.check_in)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Calendar" size={18} className="mr-2" />
              <span className="font-semibold">Выезд</span>
            </div>
            <p className="text-lg text-charcoal-900">{formatDate(booking.check_out)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 mb-2">
              <Icon name="Home" size={18} className="mr-2" />
              <span className="font-semibold">Апартамент</span>
            </div>
            <p className="text-lg text-charcoal-900">№ {booking.apartment_id}</p>
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={() => onDownloadPdf(booking.id)}
            disabled={downloadingPdf === booking.id}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {downloadingPdf === booking.id ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin" />
                Генерация PDF...
              </>
            ) : (
              <>
                <Icon name="Download" size={18} />
                Скачать подтверждение
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentBookingCard;
