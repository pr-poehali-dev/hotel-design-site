import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import ScratchCards from '@/components/games/ScratchCards';

interface Booking {
  id: string;
  apartment_id?: string;
  apartment?: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price?: number;
  total_amount?: number;
}

const GuestDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [guestId, setGuestId] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

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
    
    const loadData = async () => {
      await Promise.all([
        loadGuestData(id),
        loadBookings(id)
      ]);
    };
    
    loadData();
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
      
      if (data.bookings && Array.isArray(data.bookings)) {
        const now = new Date();
        const completed = data.bookings.filter((b: Booking) => {
          if (!b.check_out) return false;
          const checkOut = new Date(b.check_out);
          return checkOut < now;
        });
        
        console.log('All bookings:', data.bookings);
        console.log('Completed bookings:', completed);
        console.log('Current date:', now);
        
        setBookings(data.bookings);
        setCompletedBookings(completed);
      } else {
        setBookings([]);
        setCompletedBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
      setCompletedBookings([]);
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

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    if (filter === 'completed') {
      filtered = bookings.filter(b => b.status === 'completed');
    } else if (filter === 'active') {
      filtered = bookings.filter(b => b.status !== 'completed');
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(b => 
        b.apartment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.check_in).getTime();
      const dateB = new Date(b.check_in).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return sorted;
  };

  const filteredBookings = getFilteredBookings();
  const activeCount = bookings.filter(b => b.status !== 'completed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="User" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white">Личный кабинет</h1>
                <p className="text-xs sm:text-sm text-white/60">{guestName || 'Гость'}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/10 text-xs sm:text-sm px-3 sm:px-4"
              size="sm"
            >
              <Icon name="LogOut" className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Выход</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed top-20 right-4 z-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon name={isVip ? "Crown" : "User"} className={`${isVip ? 'text-yellow-400' : 'text-white/60'} w-5 h-5`} />
            <div>
              <p className="text-white/60 text-xs">Статус</p>
              <p className={`text-sm font-bold ${isVip ? 'text-yellow-400' : 'text-white'}`}>
                {isVip ? 'VIP' : 'Обычный'}
              </p>
            </div>
          </div>
          
          {!isVip && (
            <div className="flex items-center gap-2 opacity-40">
              <Icon name="Crown" className="text-white/40 w-5 h-5" />
              <div>
                <p className="text-white/40 text-xs">VIP</p>
                <p className="text-white/40 text-sm font-bold">Не активирован</p>
              </div>
            </div>
          )}
          
          <div className="pt-3 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Icon name="Star" className="text-yellow-400 w-5 h-5" />
              <div>
                <p className="text-white/60 text-xs">Баллы</p>
                <p className="text-white text-sm font-bold">{(bonusPoints || 0).toLocaleString('ru-RU')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {isVip && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Icon name="Crown" className="text-white w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">VIP статус активен</h3>
                </div>
                <div className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                  <p className="mb-2 sm:mb-3">Поздравляем! Вы являетесь VIP гостем премиум апартаментов на Поклонной 9.</p>
                  <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <li>При каждом заселении от 3х ночей Вы получите повышенный комплимент.</li>
                    <li>Вам будут начисляться баллы, где 1 балл = 1 рублю.</li>
                  </ol>
                  <p className="mt-2 sm:mt-3">Вы сможете списывать баллы за будущее проживание.</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg border border-yellow-200 shadow-sm">
                  <Icon name="Star" className="text-yellow-600 w-5 h-5 sm:w-6 sm:h-6" />
                  <div>
                    <p className="text-gray-600 text-xs">Ваши бонусные баллы</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{(bonusPoints || 0).toLocaleString('ru-RU')} баллов</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {!isLoading && guestId && completedBookings.length > 0 && (
          <div className="mb-6 space-y-4">
            {completedBookings.map((booking) => (
              <ScratchCards
                key={booking.id}
                guestId={guestId}
                bookingId={booking.id}
                onPointsUpdate={handlePointsUpdate}
                apartmentName={booking.apartment || 'Апартаменты'}
                hideAfterScratch={true}
              />
            ))}
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Мои бронирования</h2>
                <p className="text-white/60 text-sm sm:text-base">Здесь вы можете увидеть все ваши бронирования</p>
              </div>
              
              {bookings.length > 0 && (
                <button
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg text-white text-sm font-medium transition-all self-start sm:self-auto"
                >
                  <Icon name={sortOrder === 'newest' ? 'ArrowDownWideNarrow' : 'ArrowUpNarrowWide'} size={16} />
                  <span>{sortOrder === 'newest' ? 'Сначала новые' : 'Сначала старые'}</span>
                </button>
              )}
            </div>
            
            {bookings.length > 0 && (
              <>
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="Поиск по названию апартаментов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      <Icon name="X" size={18} />
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-1 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      filter === 'all'
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Все ({bookings.length})
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      filter === 'active'
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Активные ({activeCount})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      filter === 'completed'
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Завершенные ({completedCount})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Icon name="Loader2" className="animate-spin text-gold-500 mx-auto mb-4 w-10 h-10 sm:w-12 sm:h-12" />
              <p className="text-white/60 text-sm sm:text-base">Загрузка...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 sm:p-12">
            <div className="text-center">
              <Icon name="Calendar" className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 text-white/20" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Нет бронирований</h3>
              <p className="text-white/60 mb-6 text-sm sm:text-base">У вас пока нет активных бронирований</p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-sm sm:text-base"
              >
                <Icon name="Home" className="mr-2 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                На главную
              </Button>
            </div>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 sm:p-12">
            <div className="text-center">
              <Icon name={searchQuery ? 'Search' : 'Filter'} className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 text-white/20" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Ничего не найдено</h3>
              <p className="text-white/60 mb-6 text-sm sm:text-base">
                {searchQuery 
                  ? `Не найдено бронирований с "${searchQuery}"` 
                  : filter === 'active' 
                    ? 'У вас нет активных бронирований' 
                    : 'У вас нет завершенных бронирований'}
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-sm sm:text-base"
                  >
                    <Icon name="X" className="mr-2 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    Очистить поиск
                  </Button>
                )}
                {filter !== 'all' && (
                  <Button
                    onClick={() => setFilter('all')}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-sm sm:text-base"
                  >
                    <Icon name="RotateCcw" className="mr-2 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    Показать все
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="bg-white/5 backdrop-blur-xl border-white/10 p-4 sm:p-6 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                    <Icon name="Building2" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    booking.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {booking.status === 'active' ? 'Активно' :
                     booking.status === 'upcoming' ? 'Предстоит' : 'Завершено'}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{booking.apartment || 'Апартаменты'}</h3>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <Icon name="Calendar" className="text-white/40 w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-white/60">Заезд: </span>
                      <span className="text-white font-medium">{booking.check_in ? formatDate(booking.check_in) : '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <Icon name="Calendar" className="text-white/40 w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-white/60">Выезд: </span>
                      <span className="text-white font-medium">{booking.check_out ? formatDate(booking.check_out) : '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm pt-2.5 border-t border-white/10">
                    <Icon name="DollarSign" className="text-gold-400 w-4 h-4" />
                    <span className="text-white/60">Стоимость:</span>
                    <span className="text-gold-400 font-bold">{(booking.total_amount || booking.total_price || 0).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-12">
          <Card className="bg-white p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <Icon name="MessageCircle" className="text-gold-600 w-6 h-6 sm:w-7 sm:h-7" />
              <h3 className="text-xl sm:text-2xl font-playfair font-bold text-charcoal-900">Поддержка</h3>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <Icon name="Phone" className="text-gold-600 flex-shrink-0 w-5 h-5" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 mb-1">Телефон</p>
                  <a href="tel:+79141965172" className="text-xs sm:text-sm font-semibold text-charcoal-900 hover:text-gold-600 block truncate">+7 914 196-51-72</a>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <Icon name="Mail" className="text-gold-600 flex-shrink-0 w-5 h-5" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 mb-1">Email</p>
                  <a href="mailto:hab-agent@mail.ru" className="text-xs sm:text-sm font-semibold text-charcoal-900 hover:text-gold-600 block truncate">hab-agent@mail.ru</a>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:col-span-2 lg:col-span-1">
                <Icon name="Send" className="text-gold-600 flex-shrink-0 w-5 h-5" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 mb-1">Telegram</p>
                  <a href="https://t.me/apartamentsmsk" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-charcoal-900 hover:text-gold-600 block truncate">@apartamentsmsk</a>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => window.open('https://t.me/apartamentsmsk', '_blank')}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white text-sm sm:text-base py-2.5 sm:py-3"
            >
              <Icon name="MessageCircle" className="mr-2 w-[18px] h-[18px]" />
              Написать в Telegram
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPage;