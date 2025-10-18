import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface LoyaltyCardProps {
  bookingsCount: number;
}

const LoyaltyCard = ({ bookingsCount }: LoyaltyCardProps) => {
  const getBookingsWord = (count: number) => {
    if (count === 1) return 'бронирование';
    if (count < 5) return 'бронирования';
    return 'бронирований';
  };

  const remainingBookings = Math.max(0, 10 - bookingsCount);
  const getRemainingWord = (count: number) => {
    if (count === 1) return 'бронирование';
    return 'бронирований';
  };

  return (
    <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-t-4 border-t-gold-500 shadow-lg">
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-base md:text-2xl font-playfair">Ваш статус в программе лояльности</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Award" size={32} className="text-white md:w-12 md:h-12" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-3xl font-playfair font-bold text-charcoal-900 mb-1 md:mb-2">
              Постоянник
            </h3>
            <p className="text-sm md:text-base text-gray-700 mb-2 md:mb-3">
              У вас {bookingsCount} {getBookingsWord(bookingsCount)}
            </p>
            <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg md:text-2xl font-bold px-4 md:px-6 py-1.5 md:py-2 rounded-xl shadow-lg mb-3 md:mb-4">
              +10% к акциям
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-gray-600">Прогресс до статуса "Амбассадор"</span>
                <span className="font-semibold text-charcoal-900">{bookingsCount}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-gold-500 to-gold-600 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                  style={{ width: `${(bookingsCount / 10) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600">
                Осталось {remainingBookings} {getRemainingWord(remainingBookings)} до +15% к акциям
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <a
              href="/loyalty-program"
              className="inline-flex items-center justify-center gap-2 bg-white text-gold-600 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:shadow-lg transition-shadow border-2 border-gold-500 w-full md:w-auto"
            >
              <Icon name="Trophy" size={16} className="md:w-[18px] md:h-[18px]" />
              Подробнее о программе
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyCard;