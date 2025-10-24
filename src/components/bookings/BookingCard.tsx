import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SendGuestEmailButton from '@/components/housekeeping/SendGuestEmailButton';
import { Badge } from '@/components/ui/badge';
import { Booking } from './types';

interface BookingCardProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onManageInstructions: (apartmentId: string, guestName: string) => void;
}

const BookingCard = ({ 
  booking, 
  onEdit, 
  onDelete, 
  onManageInstructions
}: BookingCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const getStatusBadge = (checkIn: string, checkOut: string) => {
    const today = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (today < checkInDate) {
      return <Badge className="bg-blue-500">Предстоящее</Badge>;
    } else if (today >= checkInDate && today <= checkOutDate) {
      return <Badge className="bg-green-500">Активное</Badge>;
    } else {
      return <Badge variant="outline">Завершено</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl font-playfair">
                {booking.guest_name}
              </CardTitle>
              {getStatusBadge(booking.check_in, booking.check_out)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Icon name="Home" size={16} className="mr-1" />
                Апартамент {booking.apartment_id}
              </div>
              <div className="flex items-center">
                <Icon name="Mail" size={16} className="mr-1" />
                {booking.guest_email}
              </div>
              <div className="flex items-center">
                <Icon name="Phone" size={16} className="mr-1" />
                {booking.guest_phone}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 text-sm">
              <Icon name="Calendar" size={16} className="mr-2" />
              Заезд
            </div>
            <p className="font-semibold text-charcoal-900">
              {formatDate(booking.check_in)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 text-sm">
              <Icon name="Calendar" size={16} className="mr-2" />
              Выезд
            </div>
            <p className="font-semibold text-charcoal-900">
              {formatDate(booking.check_out)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-gray-600 text-sm">
              <Icon name="Hash" size={16} className="mr-2" />
              Номер брони
            </div>
            <p className="font-semibold text-charcoal-900">{booking.id}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {booking.show_to_guest ? (
              <div className="flex items-center text-green-600 text-sm">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Email отправлен
              </div>
            ) : (
              <div className="flex items-center text-gray-500 text-sm">
                <Icon name="Mail" size={16} className="mr-2" />
                Email не отправлен
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="default" 
              size="sm"
              className="bg-gold-500 hover:bg-gold-600"
              onClick={() => onManageInstructions(booking.apartment_id, booking.guest_name)}
            >
              <Icon name="FileText" size={16} className="mr-2" />
              Инструкции
            </Button>
            <SendGuestEmailButton
              bookingId={booking.id}
              apartmentId={booking.apartment_id}
              guestEmail={booking.guest_email}
              guestName={booking.guest_name}
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(booking)}
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(booking.id)}
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;