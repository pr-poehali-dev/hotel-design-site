import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface RoomDetails {
  price_per_night: number;
}

interface BookingFormProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  roomDetails: RoomDetails | null;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  guestPhone: string;
  setGuestPhone: (phone: string) => void;
  adults: number;
  setAdults: (adults: number) => void;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function BookingForm({
  checkInDate,
  checkOutDate,
  roomDetails,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  adults,
  setAdults,
  submitting,
  handleSubmit
}: BookingFormProps) {
  const totalNights = checkInDate && checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 0;
  const pricePerNight = roomDetails?.price_per_night || 0;
  const totalPrice = totalNights * pricePerNight;

  return (
    <Card className="p-6 bg-charcoal-800/50 border-gold-500/20">
      <h2 className="text-xl font-bold text-gold-400 mb-4">
        Детали бронирования
      </h2>

      {checkInDate && checkOutDate ? (
        <div className="mb-6 p-4 bg-charcoal-900/50 rounded-lg space-y-3">
          <div className="flex justify-between text-white mb-2">
            <span>Заезд:</span>
            <span className="font-semibold">{format(checkInDate, 'dd MMM yyyy', { locale: ru })}</span>
          </div>
          <div className="flex justify-between text-white mb-2">
            <span>Выезд:</span>
            <span className="font-semibold">{format(checkOutDate, 'dd MMM yyyy', { locale: ru })}</span>
          </div>
          <div className="flex justify-between text-white mb-2">
            <span>Ночей:</span>
            <span className="font-semibold">{totalNights}</span>
          </div>
          {pricePerNight > 0 && (
            <>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>{(pricePerNight || 0).toLocaleString()} ₽ × {totalNights} ночей</span>
                <span>{(totalPrice || 0).toLocaleString()} ₽</span>
              </div>
              <div className="pt-3 border-t border-gold-500/20">
                <div className="flex justify-between text-gold-400 font-bold text-lg">
                  <span>Итого:</span>
                  <span>{(totalPrice || 0).toLocaleString()} ₽</span>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-charcoal-900/50 rounded-lg text-center text-gray-400">
          Выберите даты заезда и выезда
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ваше имя *
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Телефон *
          </label>
          <input
            type="tel"
            required
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Количество гостей
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-charcoal-900/50 border border-gold-500/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold"
          disabled={!checkInDate || !checkOutDate || submitting}
        >
          <Icon name="Calendar" size={18} className="mr-2" />
          {submitting ? 'Отправка...' : 'Забронировать'}
        </Button>
      </form>
    </Card>
  );
}
