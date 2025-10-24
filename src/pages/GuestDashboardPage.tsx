import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  apartment: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number;
}

const GuestDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('guestAuthenticated');
    const name = localStorage.getItem('guestName');
    const guestId = localStorage.getItem('guestId');

    if (!authenticated || !guestId) {
      navigate('/guest-login');
      return;
    }

    setGuestName(name || 'Гость');
    loadBookings(guestId);
  }, [navigate]);

  const loadBookings = async (guestId: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c?guestId=${guestId}&action=bookings`);
      const data = await response.json();
      
      if (data.bookings) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить бронирования',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guestAuthenticated');
    localStorage.removeItem('guestId');
    localStorage.removeItem('guestName');
    navigate('/');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="User" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Личный кабинет</h1>
                <p className="text-sm text-white/60">{guestName}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/10"
              size="sm"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Мои бронирования</h2>
          <p className="text-white/60">Здесь вы можете увидеть все ваши бронирования</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-gold-500 mx-auto mb-4" />
              <p className="text-white/60">Загрузка...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-12">
            <div className="text-center">
              <Icon name="Calendar" size={64} className="mx-auto mb-4 text-white/20" />
              <h3 className="text-xl font-semibold text-white mb-2">Нет бронирований</h3>
              <p className="text-white/60 mb-6">У вас пока нет активных бронирований</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
              >
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-white/5 backdrop-blur-xl border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                    <Icon name="Building2" size={24} className="text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {booking.status === 'active' ? 'Активно' :
                     booking.status === 'upcoming' ? 'Предстоит' : 'Завершено'}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-4">{booking.apartment}</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Calendar" size={16} className="text-white/40" />
                    <span className="text-white/60">Заезд:</span>
                    <span className="text-white font-medium">{formatDate(booking.check_in)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Calendar" size={16} className="text-white/40" />
                    <span className="text-white/60">Выезд:</span>
                    <span className="text-white font-medium">{formatDate(booking.check_out)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm pt-3 border-t border-white/10">
                    <Icon name="DollarSign" size={16} className="text-gold-400" />
                    <span className="text-white/60">Стоимость:</span>
                    <span className="text-gold-400 font-bold">{booking.total_price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-purple-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Gift" size={24} className="text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Программа лояльности</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">Участвуйте в программе лояльности и получайте бонусы</p>
            <Button
              onClick={() => navigate('/loyalty-program')}
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30"
            >
              Подробнее
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="MapPin" size={24} className="text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Локация</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">Узнайте больше о расположении наших апартаментов</p>
            <Button
              onClick={() => navigate('/location')}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30"
            >
              На карте
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-green-500/20 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="MessageCircle" size={24} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Поддержка</h3>
            </div>
            <p className="text-white/60 text-sm mb-4">Свяжитесь с нами через Telegram</p>
            <Button
              onClick={() => window.open('https://t.me/apartamentsmsk', '_blank')}
              className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30"
            >
              <Icon name="Send" size={16} className="mr-2" />
              Написать
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPage;
