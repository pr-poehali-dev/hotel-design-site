import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ScratchCards from '@/components/games/ScratchCards';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatusCard from '@/components/dashboard/StatusCard';
import BookingsFilter from '@/components/dashboard/BookingsFilter';
import BookingCard from '@/components/dashboard/BookingCard';

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
      <DashboardHeader guestName={guestName} onLogout={handleLogout} />

      <StatusCard isVip={isVip} bonusPoints={bonusPoints} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">🎰</span>
            Игровая зона
          </h2>
          <p className="text-white/60 text-sm sm:text-base mb-4">
            Стирай карточки и выигрывай бонусные баллы!
          </p>
          <ScratchCards 
            guestId={guestId || ''} 
            bonusPoints={bonusPoints}
            onPointsUpdate={handlePointsUpdate}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">📋</span>
            Мои бронирования
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Управляйте своими бронированиями и отслеживайте историю
          </p>
        </div>

        <BookingsFilter
          filter={filter}
          sortOrder={sortOrder}
          searchQuery={searchQuery}
          activeCount={activeCount}
          completedCount={completedCount}
          onFilterChange={setFilter}
          onSortOrderChange={setSortOrder}
          onSearchQueryChange={setSearchQuery}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
            <p className="text-white/60 text-lg">Бронирования не найдены</p>
            {searchQuery && (
              <p className="text-white/40 text-sm mt-2">Попробуйте изменить критерии поиска</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboardPage;
