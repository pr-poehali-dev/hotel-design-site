import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Guest {
  id: number;
  email: string;
  name: string;
  phone: string;
  created_at: string;
  bookings?: {
    id: string;
    apartment_id: string;
    check_in: string;
    check_out: string;
    accommodation_amount: number;
    total_amount: number;
  }[];
}

interface GuestsListProps {
  guests: Guest[];
  searchQuery: string;
  onResetPassword: (email: string) => void;
  onDeleteGuest: (id: number) => void;
  onEditBooking: (guestId: number, booking: any) => void;
  onAddBooking: (guestId: number, guestName: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onClearSearch: () => void;
  onCreateCredentials: (guest: Guest) => void;
}

const GuestsList = ({
  guests,
  searchQuery,
  onResetPassword,
  onDeleteGuest,
  onEditBooking,
  onAddBooking,
  onDeleteBooking,
  onClearSearch,
  onCreateCredentials,
}: GuestsListProps) => {
  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="SearchX" size={48} className="mx-auto text-charcoal-400 mb-3" />
        <p className="text-charcoal-600">
          Ничего не найдено по запросу "{searchQuery}"
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSearch}
          className="mt-3"
        >
          Очистить поиск
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {guests.map((guest) => (
        <div
          key={guest.id}
          className="flex items-center justify-between p-4 bg-white border border-charcoal-200 rounded-lg hover:border-gold-400 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                <Icon name="User" size={20} className="text-gold-700" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-charcoal-900">
                  {guest.name || 'Без имени'}
                </p>
                <p className="text-sm text-charcoal-600">{guest.email}</p>
                {guest.phone && (
                  <p className="text-xs text-charcoal-500">{guest.phone}</p>
                )}
                {guest.bookings && guest.bookings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {guest.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-2 text-xs">
                        <Icon name="Home" size={12} className="text-gold-600" />
                        <span className="text-charcoal-700">
                          Ап. {booking.apartment_id} • {new Date(booking.check_in).toLocaleDateString('ru-RU')} - {new Date(booking.check_out).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="text-gold-600 font-semibold">• {booking.total_amount?.toLocaleString('ru-RU')} ₽</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditBooking(guest.id, booking)}
                          className="h-5 w-5 p-0 text-charcoal-500 hover:text-gold-600"
                        >
                          <Icon name="Pencil" size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteBooking(booking.id)}
                          className="h-5 w-5 p-0 text-charcoal-500 hover:text-red-600"
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddBooking(guest.id, guest.name)}
                  className="mt-2 text-xs text-gold-600 hover:text-gold-700 hover:bg-gold-50 h-6 px-2"
                >
                  <Icon name="Plus" size={12} className="mr-1" />
                  Добавить бронирование
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-charcoal-500">
              {new Date(guest.created_at).toLocaleDateString('ru-RU')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateCredentials(guest)}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              title="Создать логин и пароль"
            >
              <Icon name="UserCog" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResetPassword(guest.email)}
              className="text-gold-600 hover:text-gold-700 hover:bg-gold-50"
              title="Сбросить пароль"
            >
              <Icon name="KeyRound" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteGuest(guest.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Удалить гостя"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestsList;