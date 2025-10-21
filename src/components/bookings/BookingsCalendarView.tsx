import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  apartmentNumber: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  paymentStatus: string;
  notes?: string;
  showToGuest: boolean;
}

export default function BookingsCalendarView() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { toast } = useToast();

  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date);
    }
    return months;
  };

  const monthOptions = generateMonthOptions();
  const isCurrentMonth = selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear();

  const filteredBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn);
    return checkIn.getMonth() === selectedMonth.getMonth() && checkIn.getFullYear() === selectedMonth.getFullYear();
  });

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://functions.poehali.dev/0ec2ea3d-1c6f-4aa8-98f8-a95872c341d7');
        if (response.ok) {
          const data = await response.json();
          setBookings(data || []);
        }
      } catch (err) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить бронирования",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  const totalAmount = filteredBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const paidAmount = filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
  const unpaidAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Calendar" size={20} className="text-gold-500" />
          <span className="text-charcoal-900 font-semibold">Выбор периода</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {monthOptions.map((month, index) => {
            const isSelected = month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear();
            const isCurrent = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear();
            const label = month.toLocaleDateString('ru', { month: 'short', year: 'numeric' });

            return (
              <button
                key={index}
                onClick={() => setSelectedMonth(month)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-gold-500 text-white font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
                {isCurrent && isSelected && (
                  <span className="ml-1 text-xs">●</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 p-6">
          <div className="text-center">
            <p className="text-sm text-white/80 mb-2">Всего бронирований</p>
            <p className="text-3xl font-bold text-white">{filteredBookings.length}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 p-6">
          <div className="text-center">
            <p className="text-sm text-white/80 mb-2">Оплачено</p>
            <p className="text-3xl font-bold text-white">{paidAmount.toLocaleString('ru')} ₽</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 p-6">
          <div className="text-center">
            <p className="text-sm text-white/80 mb-2">Ожидает оплаты</p>
            <p className="text-3xl font-bold text-white">{unpaidAmount.toLocaleString('ru')} ₽</p>
          </div>
        </Card>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-charcoal-900">Бронирования</h2>
          {isCurrentMonth && (
            <span className="text-xs bg-gold-500/20 text-gold-500 px-2 py-1 rounded-full">Текущий период</span>
          )}
        </div>
        {filteredBookings.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="Calendar" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">Нет бронирований за выбранный период</p>
            <p className="text-gray-400 text-sm mt-1">Выберите другой месяц</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gold-600">#{booking.apartmentNumber}</span>
                      <span className="text-sm font-semibold text-charcoal-900">{booking.guestName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {booking.paymentStatus === 'paid' ? 'Оплачено' : 'Не оплачено'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Icon name="Mail" size={14} />
                        <span>{booking.guestEmail}</span>
                      </div>
                      {booking.guestPhone && (
                        <div className="flex items-center gap-1">
                          <Icon name="Phone" size={14} />
                          <span>{booking.guestPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(booking.checkIn).toLocaleDateString('ru')} - {new Date(booking.checkOut).toLocaleDateString('ru')}</span>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        {booking.notes}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-charcoal-900">{booking.amount.toLocaleString('ru')} ₽</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
