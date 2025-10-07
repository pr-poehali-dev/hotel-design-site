import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import BookingCard from './BookingCard';
import { Booking } from './types';

interface BookingsListProps {
  bookings: Booking[];
  onAddNew: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onManageInstructions: (apartmentId: string, guestName: string) => void;
  onOpenGuestDashboard: (bookingId: string) => void;
}

const BookingsList = ({ 
  bookings, 
  onAddNew, 
  onEdit, 
  onDelete, 
  onManageInstructions, 
  onOpenGuestDashboard 
}: BookingsListProps) => {
  if (bookings.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 text-lg mb-4">Пока нет бронирований</p>
        <Button
          onClick={onAddNew}
          className="bg-gold-500 hover:bg-gold-600"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить первого гостя
        </Button>
      </Card>
    );
  }

  return (
    <>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onEdit={onEdit}
          onDelete={onDelete}
          onManageInstructions={onManageInstructions}
          onOpenGuestDashboard={onOpenGuestDashboard}
        />
      ))}
    </>
  );
};

export default BookingsList;