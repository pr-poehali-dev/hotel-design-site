import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SendGuestEmailButton from '@/components/housekeeping/SendGuestEmailButton';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  show_to_guest: boolean;
}

const BookingsManagementPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: 'BK001',
        apartment_id: '816',
        check_in: '2025-10-10',
        check_out: '2025-10-15',
        guest_name: 'Иван Иванов',
        guest_email: 'ivan@example.com',
        guest_phone: '+7 900 123-45-67',
        show_to_guest: true,
      },
      {
        id: 'BK002',
        apartment_id: '2019',
        check_in: '2025-10-12',
        check_out: '2025-10-18',
        guest_name: 'Мария Петрова',
        guest_email: 'maria@example.com',
        guest_phone: '+7 900 234-56-78',
        show_to_guest: false,
      },
      {
        id: 'BK003',
        apartment_id: '1311',
        check_in: '2025-10-15',
        check_out: '2025-10-20',
        guest_name: 'Алексей Сидоров',
        guest_email: 'alexey@example.com',
        guest_phone: '+7 900 345-67-89',
        show_to_guest: true,
      },
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-playfair mb-2">Управление бронированиями</h1>
              <p className="text-gold-100">Отправка инструкций гостям</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10"
                onClick={() => window.location.href = '/'}
              >
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/bookings'}
            >
              <Icon name="Calendar" size={18} className="mr-2" />
              Управление бронями
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/check-in-instructions'}
            >
              <Icon name="FileText" size={18} className="mr-2" />
              Создать инструкции
            </Button>
            <Button 
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              onClick={() => window.location.href = '/guest-dashboard'}
            >
              <Icon name="Eye" size={18} className="mr-2" />
              Посмотреть как видит гость
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-lg transition-shadow">
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
                  <div className="flex gap-2">
                    <SendGuestEmailButton
                      bookingId={booking.id}
                      apartmentId={booking.apartment_id}
                      guestEmail={booking.guest_email}
                      guestName={booking.guest_name}
                    />
                    <Button variant="outline" size="sm">
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      Открыть кабинет
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagementPage;