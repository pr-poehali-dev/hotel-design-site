import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Guest, GuestStats, GuestFilter } from '@/types/guest';
import { useToast } from '@/hooks/use-toast';

export const useAdminGuests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<GuestFilter>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'revenue' | 'visits'>('name');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'guests' | 'commission'>('guests');

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

  const filteredGuests = guests
    .filter(guest => {
      const matchesSearch = 
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.phone.includes(searchQuery);
      
      const matchesFilter = 
        filter === 'all' ? true :
        filter === 'vip' ? guest.is_vip :
        !guest.is_vip;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === 'revenue') {
        return b.total_revenue - a.total_revenue;
      } else {
        return b.total_visits - a.total_visits;
      }
    });

  return {
    isAuthenticated,
    guests,
    selectedGuest,
    setSelectedGuest,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    dialogOpen,
    setDialogOpen,
    editingGuest,
    setEditingGuest,
    isRefreshing,
    showMobileDetails,
    setShowMobileDetails,
    showMobileMenu,
    setShowMobileMenu,
    activeTab,
    setActiveTab,
    filteredGuests,
    stats: calculateStats(),
    handleLogout,
    handleRefresh,
    handleSyncBnovo,
    handleSaveGuest,
    handleDeleteGuest,
    setGuests
  };
};
