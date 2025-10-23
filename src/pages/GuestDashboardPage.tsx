import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GuestDashboardHeader from '@/components/guest/GuestDashboardHeader';
import GuestDashboardTabs from '@/components/guest/GuestDashboardTabs';
import BookingsTab from '@/components/guest/BookingsTab';
import ProfileTab from '@/components/guest/ProfileTab';

const BOOKINGS_API_URL = 'https://functions.poehali.dev/5fb527bf-818a-4b1a-b986-bd90154ba94b';
const GUEST_API_URL = 'https://functions.poehali.dev/bec6ed09-6635-419d-bf79-01a96e536747';

interface Booking {
  id: string;
  apartment_id: string;
  apartment_name?: string;
  room_number?: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

interface GuestUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  username?: string;
  is_vip: boolean;
  guest_type: string;
  total_bookings: number;
  total_spent: string;
  promo_codes?: any[];
  assigned_apartments?: string[];
}

export default function GuestDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile'>('bookings');
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    loadGuestData();
  }, []);

  const loadGuestData = async () => {
    const userStr = localStorage.getItem('guest_user');
    const token = localStorage.getItem('guest_token');
    
    if (!userStr || !token) {
      navigate('/guest-login');
      return;
    }

    const user = JSON.parse(userStr);
    
    try {
      setLoading(true);
      
      const guestResponse = await fetch(`${GUEST_API_URL}?id=${user.id}`);
      if (guestResponse.ok) {
        const guestData = await guestResponse.json();
        setGuestUser(guestData);
        setProfileForm({
          name: guestData.name || '',
          phone: guestData.phone || '',
          password: ''
        });
        
        if (guestData.bookings) {
          setBookings(guestData.bookings);
        }
      } else {
        setGuestUser(user);
        
        const bookingsResponse = await fetch(BOOKINGS_API_URL, {
          headers: { 'X-User-Email': user.email }
        });
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          if (bookingsData.success) {
            setBookings(bookingsData.bookings || []);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!guestUser) return;

    try {
      const updateData: any = {
        id: guestUser.id,
        name: profileForm.name,
        phone: profileForm.phone
      };

      if (profileForm.password) {
        updateData.password = profileForm.password;
      }

      const response = await fetch(GUEST_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('Профиль обновлён');
        setEditingProfile(false);
        setProfileForm({ ...profileForm, password: '' });
        await loadGuestData();
      } else {
        alert('Ошибка при обновлении профиля');
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('guest_user');
    localStorage.removeItem('guest_token');
    navigate('/guest-login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateStr: string) => {
    const days = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getBookingStatus = (booking: Booking): 'active' | 'upcoming' | 'completed' => {
    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);
    const today = new Date();

    if (checkOutDate < today) return 'completed';
    if (checkInDate <= today && checkOutDate >= today) return 'active';
    return 'upcoming';
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setProfileForm({
      name: guestUser?.name || '',
      phone: guestUser?.phone || '',
      password: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!guestUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GuestDashboardHeader guestUser={guestUser} onLogout={handleLogout} />
      <GuestDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'bookings' ? (
          <BookingsTab
            bookings={bookings}
            getBookingStatus={getBookingStatus}
            getDaysUntil={getDaysUntil}
            formatDate={formatDate}
          />
        ) : (
          <ProfileTab
            guestUser={guestUser}
            editingProfile={editingProfile}
            profileForm={profileForm}
            onEdit={() => setEditingProfile(true)}
            onCancel={handleCancelEdit}
            onSave={handleUpdateProfile}
            onFormChange={setProfileForm}
          />
        )}
      </div>
    </div>
  );
}
