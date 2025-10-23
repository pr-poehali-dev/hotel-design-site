import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '@/components/AdminLogin';
import GuestFormModal from '@/components/admin/GuestFormModal';
import GuestDetailsPanel from '@/components/admin/GuestDetailsPanel';
import AdminDashboardHeader from '@/components/admin/AdminDashboardHeader';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminSearchAndFilters from '@/components/admin/AdminSearchAndFilters';
import AdminGuestList from '@/components/admin/AdminGuestList';
import PullToRefreshIndicator from '@/components/admin/PullToRefreshIndicator';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminMobileMenu from '@/components/admin/AdminMobileMenu';

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
  
  console.log('AdminDashboardPage v2.0 loaded');

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

  const handleClearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(reg => reg.unregister()));
    }
    
    window.location.reload();
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
      <AdminDashboardHeader
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={handleLogout}
        onClearCache={handleClearCache}
      />

      <PullToRefreshIndicator
        pullDistance={!selectedGuest ? pullDistance : 0}
        isRefreshing={isRefreshing}
      />

      <div 
        ref={contentRef}
        className="max-w-7xl mx-auto px-4 py-6 space-y-6"
        style={{
          transform: pullDistance > 0 && !selectedGuest ? `translateY(${Math.min(pullDistance, 80)}px)` : 'none',
          transition: pullDistance === 0 ? 'transform 0.2s ease-out' : 'none'
        }}
      >
        <AdminDashboardStats stats={stats} />

        <AdminSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
          onCreateGuest={() => {
            setIsCreating(true);
            setSelectedGuest(null);
          }}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <AdminGuestList
            guests={filteredGuests}
            selectedGuestId={selectedGuest?.id || null}
            loading={loading}
            isRefreshing={isRefreshing}
            onSelectGuest={loadGuestDetails}
          />

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
              <AdminEmptyState />
            )}
          </div>
        </div>
      </div>

      <AdminMobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

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