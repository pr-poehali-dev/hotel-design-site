import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import BookingCard from './BookingCard';
import PastBookingCard from './PastBookingCard';

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

interface BookingsTabProps {
  bookings: Booking[];
  getBookingStatus: (booking: Booking) => 'active' | 'upcoming' | 'completed';
  getDaysUntil: (dateStr: string) => number;
  formatDate: (dateStr: string) => string;
}

export default function BookingsTab({ 
  bookings, 
  getBookingStatus, 
  getDaysUntil, 
  formatDate 
}: BookingsTabProps) {
  const navigate = useNavigate();
  
  const activeBookings = bookings.filter(b => ['active', 'upcoming'].includes(getBookingStatus(b)));
  const pastBookings = bookings.filter(b => getBookingStatus(b) === 'completed');

  return (
    <div className="space-y-8">
      {activeBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Активные и предстоящие</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeBookings.map((booking) => {
              const status = getBookingStatus(booking);
              const daysUntil = getDaysUntil(booking.check_in);
              
              return (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  status={status}
                  daysUntil={daysUntil}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">История бронирований</h2>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <PastBookingCard
                key={booking.id}
                booking={booking}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {bookings.length === 0 && (
        <Card className="bg-white/5 border-white/10 p-12">
          <div className="text-center">
            <Icon name="Calendar" size={64} className="mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-semibold text-white mb-2">У вас пока нет бронирований</h3>
            <p className="text-white/60 mb-6">Забронируйте свой первый апартамент!</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Icon name="Search" size={16} />
              Выбрать апартамент
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
