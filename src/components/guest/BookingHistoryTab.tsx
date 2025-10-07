import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  total_amount?: number;
  early_check_in?: number;
  late_check_out?: number;
  parking?: number;
  status?: string;
}

interface BookingHistoryTabProps {
  bookings: Booking[];
  formatDate: (dateStr: string) => string;
  downloadingPdf: string | null;
  onDownloadPdf: (bookingId: string) => void;
  cancellingBooking: string | null;
  onCancelBooking: (bookingId: string) => void;
}

const BookingHistoryTab = ({ bookings, formatDate, downloadingPdf, onDownloadPdf, cancellingBooking, onCancelBooking }: BookingHistoryTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История бронирований</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b) => {
              const checkInDate = new Date(b.check_in);
              const checkOutDate = new Date(b.check_out);
              const today = new Date();
              const isPast = checkOutDate < today;
              const isUpcoming = checkInDate > today;
              const isCurrent = checkInDate <= today && checkOutDate >= today;
              const isCancelled = b.status === 'cancelled';
              const canCancel = isUpcoming && !isCancelled;

              return (
                <div
                  key={b.id}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isCancelled
                      ? 'bg-red-50 border-red-300 opacity-75'
                      : isCurrent
                      ? 'bg-green-50 border-green-300'
                      : isUpcoming
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-900 mb-1">
                        Апартамент № {b.apartment_id}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isCancelled && (
                          <Badge className="bg-red-500">Отменено</Badge>
                        )}
                        {!isCancelled && isCurrent && (
                          <Badge className="bg-green-500">Текущее</Badge>
                        )}
                        {!isCancelled && isUpcoming && (
                          <Badge className="bg-blue-500">Предстоящее</Badge>
                        )}
                        {!isCancelled && isPast && (
                          <Badge variant="outline">Завершено</Badge>
                        )}
                      </div>
                    </div>
                    {b.total_amount && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold-600">
                          {b.total_amount.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-xs text-gray-500">Стоимость</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Заезд</p>
                        <p className="font-semibold text-charcoal-900">
                          {formatDate(b.check_in)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <Icon name="Calendar" size={20} className="text-gold-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Выезд</p>
                        <p className="font-semibold text-charcoal-900">
                          {formatDate(b.check_out)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(b.early_check_in || b.late_check_out || b.parking) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Дополнительно:</p>
                      <div className="flex flex-wrap gap-2">
                        {b.early_check_in && b.early_check_in > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Ранний заезд
                          </Badge>
                        )}
                        {b.late_check_out && b.late_check_out > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Поздний выезд
                          </Badge>
                        )}
                        {b.parking && b.parking > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Icon name="Car" size={12} className="mr-1" />
                            Парковка
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    {canCancel && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        disabled={cancellingBooking === b.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                      >
                        {cancellingBooking === b.id ? (
                          <>
                            <Icon name="Loader2" size={16} className="animate-spin" />
                            Отмена...
                          </>
                        ) : (
                          <>
                            <Icon name="XCircle" size={16} />
                            Отменить бронирование
                          </>
                        )}
                      </button>
                    )}
                    {!canCancel && <div />}
                    <button
                      onClick={() => onDownloadPdf(b.id)}
                      disabled={downloadingPdf === b.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                    >
                      {downloadingPdf === b.id ? (
                        <>
                          <Icon name="Loader2" size={16} className="animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <Icon name="Download" size={16} />
                          Скачать PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>У вас пока нет бронирований</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingHistoryTab;