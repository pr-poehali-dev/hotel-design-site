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
    const authKey = localStorage.getItem('adminAuthenticated');
    if (authKey === 'true') {
      setIsAuthenticated(true);
    } else {
      navigate('/admin-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadGuests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadGuests = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filter !== 'all') params.append('filter', filter);
      
      const response = await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c?${params}`);
      const data = await response.json();
      
      const loadedGuests = data.guests.map((g: any) => ({
        ...g,
        id: g.id.toString()
      }));
      
      setGuests(loadedGuests);
      if (!selectedGuest && loadedGuests.length > 0) {
        setSelectedGuest(loadedGuests[0]);
      }
    } catch (error) {
      console.error('Error loading guests:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить гостей',
        variant: 'destructive'
      });
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
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

  const handleSyncBnovo = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2faa4887-dddc-4f5a-8a48-3073dd398dbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: 'Синхронизация завершена',
          description: `Бронирований: ${data.synced_bookings}, Гостей: ${data.created_guests}`
        });
        await loadGuests();
      } else {
        toast({
          title: 'Ошибка синхронизации',
          description: data.error || 'Неизвестная ошибка',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Failed to sync with Bnovo:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось синхронизировать с Bnovo',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveGuest = async (guestData: Partial<Guest>) => {
    try {
      if (editingGuest) {
        const response = await fetch('https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...guestData, id: editingGuest.id })
        });
        const data = await response.json();
        setGuests(prev => prev.map(g => g.id === editingGuest.id ? { ...data.guest, id: data.guest.id.toString() } : g));
        toast({ title: 'Сохранено', description: 'Данные гостя обновлены' });
      } else {
        const response = await fetch('https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guestData)
        });
        const data = await response.json();
        const newGuest = { ...data.guest, id: data.guest.id.toString() };
        setGuests(prev => [newGuest, ...prev]);
        setSelectedGuest(newGuest);
        toast({ title: 'Создано', description: 'Новый гость добавлен' });
      }
      setEditingGuest(null);
      loadGuests();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить гостя',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteGuest = async (guest: Guest) => {
    if (confirm(`Удалить гостя ${guest.name}?`)) {
      try {
        await fetch(`https://functions.poehali.dev/161fad1a-0c6f-4c29-8baf-f3b052e62b5c?id=${guest.id}`, {
          method: 'DELETE'
        });
        setGuests(prev => prev.filter(g => g.id !== guest.id));
        setSelectedGuest(null);
        toast({ title: 'Удалено', description: 'Гость удален из системы' });
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить гостя',
          variant: 'destructive'
        });
      }
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />
      
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700"
                size="sm"
              >
                <Icon name="Menu" size={20} />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Управление гостями</h1>
                <p className="text-sm text-gray-600">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSyncBnovo}
                disabled={isRefreshing}
                className="bg-blue-500 hover:bg-blue-600 text-white hidden md:flex"
                size="sm"
              >
                <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="ml-2">Синхронизация Bnovo</span>
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 hidden md:flex"
                size="sm"
              >
                <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
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
          <div className="absolute left-0 top-16 bottom-0 w-64 bg-white p-4 shadow-xl">
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
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <Button
                onClick={() => {
                  setDialogOpen(true);
                  setEditingGuest(null);
                }}
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white hidden lg:flex"
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
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
                    setEditingGuest(guest);
                    setDialogOpen(true);
                    setShowMobileDetails(true);
                  }}
                />
              ))}
              {filteredGuests.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Гостей не найдено</p>
                </div>
              )}
            </div>
          </div>

          <div className={`lg:col-span-2 ${showMobileDetails ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4 lg:relative lg:inset-auto lg:z-0 lg:p-0' : 'hidden lg:block'}`}>
            {showMobileDetails && (
              <Button
                onClick={() => setShowMobileDetails(false)}
                className="lg:hidden mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                onUpdate={(updatedGuest) => {
                  setGuests(guests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
                  setSelectedGuest(updatedGuest);
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center text-gray-500">
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