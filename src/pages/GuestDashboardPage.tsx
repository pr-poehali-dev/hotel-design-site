import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import FortuneWheelBonus from '@/components/games/FortuneWheelBonus';
import ScratchCards from '@/components/games/ScratchCards';

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
  const [guestId, setGuestId] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('guestAuthenticated');
    const name = localStorage.getItem('guestName');
    const id = localStorage.getItem('guestId');
    const vip = localStorage.getItem('guestIsVip') === 'true';

    if (!authenticated || !id) {
      navigate('/guest-login');
      return;
    }

    setGuestName(name || 'Гость');
    setGuestId(id);
    setIsVip(vip);
    loadGuestData(id);
    loadBookings(id);
  }, [navigate]);

  const loadGuestData = async (guestId: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c`);
      const data = await response.json();
      
      if (data.guests) {
        const guest = data.guests.find((g: any) => String(g.id) === String(guestId));
        if (guest) {
          setBonusPoints(guest.bonus_points || 0);
          setIsVip(guest.is_vip);
        }
      }
    } catch (error) {
      console.error('Error loading guest data:', error);
    }
  };

  const loadBookings = async (guestId: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c?guestId=${guestId}&action=bookings`);
      const data = await response.json();
      
      if (data.bookings) {
        const now = new Date();
        const completed = data.bookings.filter((b: Booking) => {
          const checkOut = new Date(b.check_out);
          return checkOut < now && b.status === 'completed';
        });
        
        setBookings(data.bookings);
        setCompletedBookings(completed);
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

  const handlePointsUpdate = (newPoints: number) => {
    setBonusPoints(newPoints);
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
        {isVip && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Icon name="Crown" size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">VIP статус активен</h3>
                </div>
                <div className="text-gray-700 text-sm mb-4 leading-relaxed">
                  <p className="mb-3">Поздравляем! Вы являетесь VIP гостем премиум апартаментов на Поклонной 9.</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>При каждом заселении от 3х ночей Вы получите повышенный комплимент.</li>
                    <li>Вам будут начисляться баллы, где 1 балл = 1 рублю.</li>
                  </ol>
                  <p className="mt-3">Вы сможете списывать баллы за будущее проживание.</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-yellow-200 shadow-sm">
                  <Icon name="Star" size={24} className="text-yellow-600" />
                  <div>
                    <p className="text-gray-600 text-xs">Ваши бонусные баллы</p>
                    <p className="text-2xl font-bold text-gray-900">{bonusPoints.toLocaleString('ru-RU')} ₽</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FortuneWheelBonus guestId={guestId} onPointsUpdate={handlePointsUpdate} />
          
          {completedBookings.length > 0 && (
            <ScratchCards
              guestId={guestId}
              bookingId={completedBookings[0].id}
              onPointsUpdate={handlePointsUpdate}
            />
          )}
        </div>

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

        <div className="mt-12">
          <Card className="bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <Icon name="MessageCircle" size={28} className="text-gold-600" />
              <h3 className="text-2xl font-playfair font-bold text-charcoal-900">Поддержка</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Icon name="Phone" size={20} className="text-gold-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Телефон</p>
                  <a href="tel:+79141965172" className="text-sm font-semibold text-charcoal-900 hover:text-gold-600">+7 914 196-51-72</a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Icon name="Mail" size={20} className="text-gold-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <a href="mailto:hab-agent@mail.ru" className="text-sm font-semibold text-charcoal-900 hover:text-gold-600 break-all">hab-agent@mail.ru</a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Icon name="Send" size={20} className="text-gold-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 mb-1">Telegram</p>
                  <a href="https://t.me/apartamentsmsk" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-charcoal-900 hover:text-gold-600">@apartamentsmsk</a>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => window.open('https://t.me/apartamentsmsk', '_blank')}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white"
            >
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Написать в Telegram
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPage;