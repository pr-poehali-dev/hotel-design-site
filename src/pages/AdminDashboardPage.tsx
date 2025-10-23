import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import GuestFormModal from '@/components/admin/GuestFormModal';
import GuestDetailsPanel from '@/components/admin/GuestDetailsPanel';

const AUTH_KEY = 'premium_apartments_admin_auth';
const API_URL = 'https://functions.poehali.dev/bec6ed09-6635-419d-bf79-01a96e536747';

interface Guest {
  id: number;
  username: string | null;
  email: string;
  name: string;
  phone: string;
  status: string;
  guest_type: string;
  is_vip: boolean;
  total_bookings: number;
  total_spent: string;
  assigned_apartments?: string[];
  admin_notes?: string;
  created_at: string;
}

interface GuestWithBookings extends Guest {
  bookings?: any[];
}

interface Stats {
  total: number;
  vip: number;
  active: number;
  totalRevenue: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestWithBookings | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'vip' | 'regular'>('all');
  const [stats, setStats] = useState<Stats>({ total: 0, vip: 0, active: 0, totalRevenue: '0' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [hasVibrated, setHasVibrated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const apartmentCategories = [
    { id: '1759775593604', name: 'Gold Suite' },
    { id: '1759775530117', name: 'Bearbrick Studio' },
    { id: '1759774533761', name: 'Fireplace Luxury' },
    { id: '1759773745026', name: 'Family Joy' },
    { id: '1759774889950', name: 'Mirror Studio' },
    { id: '1759775640034', name: 'Panorama Suite' },
    { id: '1759775450678', name: 'Cozy Corner' },
    { id: '1759775039895', name: 'Vista Point' },
    { id: '1759775297513', name: 'Cyber Space' }
  ];

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const loadGuests = async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    try {
      const url = searchTerm 
        ? `${API_URL}?search=${encodeURIComponent(searchTerm)}`
        : API_URL;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const guestList = data.guests || [];
        setGuests(guestList);
        
        const statsData: Stats = {
          total: guestList.length,
          vip: guestList.filter((g: Guest) => g.is_vip).length,
          active: guestList.filter((g: Guest) => g.status === 'active').length,
          totalRevenue: guestList.reduce((sum: number, g: Guest) => sum + parseFloat(g.total_spent || '0'), 0).toFixed(2)
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to load guests:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadGuests();
    }
  }, [isAuthenticated, searchTerm]);

  const loadGuestDetails = async (guestId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?id=${guestId}`);
      if (response.ok) {
        const guest = await response.json();
        setSelectedGuest(guest);
        setIsMobileMenuOpen(false);
      }
    } catch (error) {
      console.error('Failed to load guest details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop === 0 && !selectedGuest) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY === 0 || isRefreshing || selectedGuest) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - pullStartY;
    
    if (distance > 0 && distance < 120) {
      setPullDistance(distance);
      e.preventDefault();
      
      if (distance > 80 && !hasVibrated) {
        triggerHaptic();
        setHasVibrated(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 80 && !isRefreshing && !selectedGuest) {
      setIsRefreshing(true);
      await loadGuests(true);
    }
    setPullStartY(0);
    setPullDistance(0);
    setHasVibrated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    navigate('/');
  };

  const filteredGuests = guests.filter(guest => {
    if (filterType === 'vip') return guest.is_vip;
    if (filterType === 'regular') return !guest.is_vip;
    return true;
  });

  const getGuestTypeColor = (type: string) => {
    switch (type) {
      case 'vip': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'regular': return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'blacklist': return 'bg-gradient-to-r from-red-500 to-red-700';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Управление гостями</h1>
                <p className="text-xs text-white/60 hidden md:block">Админ-панель</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                variant="ghost"
                size="sm"
                className="md:hidden text-white"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-white hover:bg-white/10"
              >
                <Icon name="LogOut" size={18} />
                <span className="hidden lg:inline ml-2">Выход</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && !selectedGuest && (
        <div 
          className="flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          style={{ 
            height: `${Math.min(pullDistance, 80)}px`,
            opacity: pullDistance / 80
          }}
        >
          <div className="text-white flex items-center gap-2">
            <Icon 
              name="RefreshCw" 
              size={20} 
              className={`${isRefreshing ? 'animate-spin' : ''} ${pullDistance > 80 ? 'rotate-180' : ''} transition-transform`}
            />
            <span className="text-sm">
              {isRefreshing ? 'Обновление...' : pullDistance > 80 ? 'Отпустите для обновления' : 'Потяните для обновления'}
            </span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div 
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 py-6 space-y-6"
        style={{
          transform: pullDistance > 0 && !selectedGuest ? `translateY(${Math.min(pullDistance, 80)}px)` : 'none',
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs md:text-sm">Всего гостей</p>
                <p className="text-white text-2xl md:text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="Crown" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs md:text-sm">VIP гостей</p>
                <p className="text-white text-2xl md:text-3xl font-bold">{stats.vip}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="UserCheck" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs md:text-sm">Активных</p>
                <p className="text-white text-2xl md:text-3xl font-bold">{stats.active}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs md:text-sm">Доход</p>
                <p className="text-white text-lg md:text-2xl font-bold">${stats.totalRevenue}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filters */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по имени, email, телефону..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                onClick={() => setFilterType('all')}
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                className={filterType === 'all' ? 'bg-white text-slate-900' : 'border-white/30 text-white hover:bg-white/10'}
              >
                Все
              </Button>
              <Button
                onClick={() => setFilterType('vip')}
                variant={filterType === 'vip' ? 'default' : 'outline'}
                size="sm"
                className={filterType === 'vip' ? 'bg-yellow-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}
              >
                <Icon name="Crown" size={16} />
                VIP
              </Button>
              <Button
                onClick={() => setFilterType('regular')}
                variant={filterType === 'regular' ? 'default' : 'outline'}
                size="sm"
                className={filterType === 'regular' ? 'bg-blue-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}
              >
                Обычные
              </Button>
            </div>

            <Button
              onClick={() => {
                setIsCreating(true);
                setSelectedGuest(null);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Icon name="UserPlus" size={18} />
              <span className="hidden md:inline ml-2">Добавить гостя</span>
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Guests List */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 lg:p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="List" size={20} />
              Список гостей ({filteredGuests.length})
            </h2>
            
            {loading && !isRefreshing ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredGuests.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="UserX" size={48} className="text-white/30 mx-auto mb-3" />
                <p className="text-white/60">Гостей не найдено</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredGuests.map(guest => (
                  <Card
                    key={guest.id}
                    onClick={() => loadGuestDetails(guest.id)}
                    className={`p-4 cursor-pointer transition-all hover:scale-[1.02] border-2 ${
                      selectedGuest?.id === guest.id 
                        ? 'border-purple-500 bg-white/20' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full ${getGuestTypeColor(guest.guest_type)} flex items-center justify-center flex-shrink-0`}>
                        {guest.is_vip ? (
                          <Icon name="Crown" size={20} className="text-white" />
                        ) : (
                          <Icon name="User" size={20} className="text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">{guest.name}</h3>
                          {guest.is_vip && (
                            <Badge className="bg-yellow-500 text-white text-xs px-1 py-0">VIP</Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/70 truncate">{guest.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={12} />
                            {guest.total_bookings} броней
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="DollarSign" size={12} />
                            ${guest.total_spent}
                          </span>
                        </div>
                      </div>
                      
                      <Icon name="ChevronRight" size={20} className="text-white/40 flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Details Panel */}
          <div className={`${selectedGuest || isCreating || isEditing ? 'block' : 'hidden lg:block'}`}>
            {selectedGuest ? (
              <GuestDetailsPanel
                guest={selectedGuest}
                onEdit={() => setIsEditing(true)}
                onDelete={async () => {
                  if (!confirm('Удалить гостя? Это действие нельзя отменить.')) return;
                  try {
                    const response = await fetch(`${API_URL}?id=${selectedGuest.id}`, { method: 'DELETE' });
                    if (response.ok) {
                      setSelectedGuest(null);
                      await loadGuests();
                    }
                  } catch (error) {
                    console.error('Failed to delete:', error);
                  }
                }}
                onClose={() => setSelectedGuest(null)}
                apartmentCategories={apartmentCategories}
              />
            ) : isCreating || isEditing ? (
              <GuestFormModal
                isOpen={isCreating || isEditing}
                onClose={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                onSubmit={async (formData) => {
                  try {
                    if (isEditing && selectedGuest) {
                      const response = await fetch(API_URL, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: selectedGuest.id, ...formData })
                      });
                      if (response.ok) {
                        setIsEditing(false);
                        await loadGuests();
                        await loadGuestDetails(selectedGuest.id);
                      }
                    } else {
                      const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                      });
                      if (response.ok) {
                        setIsCreating(false);
                        await loadGuests();
                      }
                    }
                  } catch (error) {
                    console.error('Failed to save:', error);
                  }
                }}
                initialData={isEditing && selectedGuest ? {
                  username: selectedGuest.username || '',
                  password: '',
                  email: selectedGuest.email,
                  name: selectedGuest.name,
                  phone: selectedGuest.phone,
                  guest_type: selectedGuest.guest_type,
                  assigned_apartments: selectedGuest.assigned_apartments || [],
                  admin_notes: selectedGuest.admin_notes || '',
                  is_vip: selectedGuest.is_vip
                } : undefined}
                apartmentCategories={apartmentCategories}
                mode={isEditing ? 'edit' : 'create'}
              />
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Icon name="UserSearch" size={40} className="text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Выберите гостя</h3>
                <p className="text-white/60 max-w-sm">
                  Нажмите на гостя из списка слева, чтобы увидеть детали и управлять данными
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-16 right-4 bg-slate-900 rounded-lg p-4 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <Icon name="LogOut" size={18} />
              <span className="ml-2">Выход</span>
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
