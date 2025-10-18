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
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-2xl">История бронирований</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
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
                  className={`p-3 md:p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                    isCancelled
                      ? 'bg-red-50 border-red-300 opacity-75'
                      : isCurrent
                      ? 'bg-green-50 border-green-300'
                      : isUpcoming
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 md:mb-4">
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-charcoal-900 mb-1">
                        Апартамент № {b.apartment_id}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isCancelled && (
                          <Badge className="bg-red-500 text-xs">Отменено</Badge>
                        )}
                        {!isCancelled && isCurrent && (
                          <Badge className="bg-green-500 text-xs">Текущее</Badge>
                        )}
                        {!isCancelled && isUpcoming && (
                          <Badge className="bg-blue-500 text-xs">Предстоящее</Badge>
                        )}
                        {!isCancelled && isPast && (
                          <Badge variant="outline" className="text-xs">Завершено</Badge>
                        )}
                      </div>
                    </div>
                    {b.total_amount && (
                      <div className="text-left sm:text-right">
                        <p className="text-lg md:text-2xl font-bold text-gold-600">
                          {b.total_amount.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-xs text-gray-500">Стоимость</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Calendar" size={16} className="text-gold-600 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Заезд</p>
                        <p className="font-semibold text-sm md:text-base text-charcoal-900">
                          {formatDate(b.check_in)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="Calendar" size={16} className="text-gold-600 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Выезд</p>
                        <p className="font-semibold text-sm md:text-base text-charcoal-900">
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

                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between gap-2">
                    {canCancel && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        disabled={cancellingBooking === b.id}
                        className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs md:text-sm font-medium transition-all disabled:opacity-50 w-full sm:w-auto"
                      >
                        {cancellingBooking === b.id ? (
                          <>
                            <Icon name="Loader2" size={14} className="animate-spin md:w-4 md:h-4" />
                            Отмена...
                          </>
                        ) : (
                          <>
                            <Icon name="XCircle" size={14} className="md:w-4 md:h-4" />
                            Отменить
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => onDownloadPdf(b.id)}
                      disabled={downloadingPdf === b.id}
                      className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-xs md:text-sm font-medium transition-all disabled:opacity-50 w-full sm:w-auto"
                    >
                      {downloadingPdf === b.id ? (
                        <>
                          <Icon name="Loader2" size={14} className="animate-spin md:w-4 md:h-4" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <Icon name="Download" size={14} className="md:w-4 md:h-4" />
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