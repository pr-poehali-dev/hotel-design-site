import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import StatsCard from '@/components/admin-guests/StatsCard';
import GuestCard from '@/components/admin-guests/GuestCard';
import GuestDetails from '@/components/admin-guests/GuestDetails';
import GuestDialog from '@/components/admin-guests/GuestDialog';
import AdminLogin from '@/components/AdminLogin';
import { Guest, GuestStats, GuestFilter } from '@/types/guest';
import { useToast } from '@/hooks/use-toast';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<GuestFilter>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const authKey = localStorage.getItem('premium_apartments_admin_auth');
    setIsAuthenticated(authKey === 'authenticated');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadGuests();
    }
  }, [isAuthenticated]);

  const loadGuests = () => {
    const mockGuests: Guest[] = [
      {
        id: '1',
        name: 'Александр Петров',
        email: 'alex@example.com',
        phone: '+7 (999) 123-45-67',
        is_vip: true,
        bookings_count: 15,
        total_revenue: 450000,
        last_visit: '2024-10-15',
        notes: 'Постоянный клиент, предпочитает апартаменты с видом на парк',
        created_at: '2023-05-10'
      },
      {
        id: '2',
        name: 'Мария Иванова',
        email: 'maria@example.com',
        phone: '+7 (999) 234-56-78',
        is_vip: false,
        bookings_count: 3,
        total_revenue: 75000,
        last_visit: '2024-09-20',
        notes: '',
        created_at: '2024-01-15'
      },
      {
        id: '3',
        name: 'Дмитрий Соколов',
        email: 'dmitry@example.com',
        phone: '+7 (999) 345-67-89',
        is_vip: true,
        bookings_count: 22,
        total_revenue: 890000,
        last_visit: '2024-10-22',
        notes: 'VIP клиент, всегда заказывает дополнительные услуги',
        created_at: '2022-11-05'
      },
      {
        id: '4',
        name: 'Елена Смирнова',
        email: 'elena@example.com',
        phone: '+7 (999) 456-78-90',
        is_vip: false,
        bookings_count: 1,
        total_revenue: 25000,
        last_visit: '2024-08-10',
        notes: '',
        created_at: '2024-08-01'
      }
    ];
    setGuests(mockGuests);
    if (!selectedGuest && mockGuests.length > 0) {
      setSelectedGuest(mockGuests[0]);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('premium_apartments_admin_auth');
    navigate('/admin-login');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadGuests();
    setIsRefreshing(false);
    toast({
      title: 'Обновлено',
      description: 'Список гостей успешно обновлен'
    });
  };

  const handleSaveGuest = (guestData: Partial<Guest>) => {
    if (editingGuest) {
      setGuests(prev => prev.map(g => g.id === editingGuest.id ? { ...g, ...guestData } : g));
      toast({ title: 'Сохранено', description: 'Данные гостя обновлены' });
    } else {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: guestData.name || '',
        email: guestData.email || '',
        phone: guestData.phone || '',
        is_vip: guestData.is_vip || false,
        bookings_count: 0,
        total_revenue: 0,
        last_visit: null,
        notes: guestData.notes || '',
        created_at: new Date().toISOString()
      };
      setGuests(prev => [newGuest, ...prev]);
      toast({ title: 'Создано', description: 'Новый гость добавлен' });
    }
    setEditingGuest(null);
  };

  const handleDeleteGuest = (guest: Guest) => {
    if (confirm(`Удалить гостя ${guest.name}?`)) {
      setGuests(prev => prev.filter(g => g.id !== guest.id));
      setSelectedGuest(null);
      toast({ title: 'Удалено', description: 'Гость удален из системы' });
    }
  };

  const calculateStats = (): GuestStats => {
    return {
      total_guests: guests.length,
      vip_guests: guests.filter(g => g.is_vip).length,
      active_guests: guests.filter(g => g.last_visit && new Date(g.last_visit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
      total_revenue: guests.reduce((sum, g) => sum + g.total_revenue, 0)
    };
  };

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery);
    
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'vip' ? guest.is_vip :
      !guest.is_vip;

    return matchesSearch && matchesFilter;
  });

  const stats = calculateStats();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/10"
                size="sm"
              >
                <Icon name="Menu" size={20} />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Управление гостями</h1>
                <p className="text-sm text-white/60">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/10 hidden md:flex"
                size="sm"
              >
                <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/10"
                size="sm"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-gradient-to-br from-purple-900 to-pink-900 p-4 shadow-xl">
            <Button
              onClick={() => {
                setDialogOpen(true);
                setEditingGuest(null);
                setShowMobileMenu(false);
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Новый гость
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Всего гостей"
            value={stats.total_guests}
            icon="Users"
            gradient="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
          />
          <StatsCard
            title="VIP гостей"
            value={stats.vip_guests}
            icon="Crown"
            gradient="bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
          />
          <StatsCard
            title="Активных"
            value={stats.active_guests}
            icon="TrendingUp"
            gradient="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
          />
          <StatsCard
            title="Общий доход"
            value={`${(stats.total_revenue / 1000).toFixed(0)}k ₽`}
            icon="DollarSign"
            gradient="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                />
              </div>
              <Button
                onClick={() => {
                  setDialogOpen(true);
                  setEditingGuest(null);
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hidden lg:flex"
              >
                <Icon name="Plus" size={18} />
              </Button>
            </div>

            <div className="flex gap-2">
              {(['all', 'vip', 'regular'] as GuestFilter[]).map((f) => (
                <Button
                  key={f}
                  onClick={() => setFilter(f)}
                  size="sm"
                  className={`flex-1 ${
                    filter === f
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  } backdrop-blur-sm border-white/10`}
                >
                  {f === 'all' ? 'Все' : f === 'vip' ? 'VIP' : 'Обычные'}
                </Button>
              ))}
            </div>

            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {filteredGuests.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  isSelected={selectedGuest?.id === guest.id}
                  onClick={() => {
                    setSelectedGuest(guest);
                    setShowMobileDetails(true);
                  }}
                />
              ))}
              {filteredGuests.length === 0 && (
                <div className="text-center py-12 text-white/60">
                  <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Гостей не найдено</p>
                </div>
              )}
            </div>
          </div>

          <div className={`lg:col-span-2 ${showMobileDetails ? 'fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 overflow-y-auto p-4 lg:relative lg:inset-auto lg:z-0 lg:p-0' : 'hidden lg:block'}`}>
            {showMobileDetails && (
              <Button
                onClick={() => setShowMobileDetails(false)}
                className="lg:hidden mb-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
                size="sm"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
            )}
            {selectedGuest ? (
              <GuestDetails
                guest={selectedGuest}
                onEdit={() => {
                  setEditingGuest(selectedGuest);
                  setDialogOpen(true);
                }}
                onDelete={() => handleDeleteGuest(selectedGuest)}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-white/60">
                  <Icon name="Users" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Выберите гостя для просмотра деталей</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <GuestDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingGuest(null);
        }}
        onSave={handleSaveGuest}
        guest={editingGuest}
      />
    </div>
  );
};

export default AdminDashboardPage;
