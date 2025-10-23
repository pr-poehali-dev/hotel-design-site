import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';
import GuestListItem from '@/components/admin/GuestListItem';
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

export default function GuestManagementPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestWithBookings | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState<{[key: number]: boolean}>({});
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    phone: '',
    guest_type: 'regular',
    assigned_apartments: [] as string[],
    admin_notes: '',
    is_vip: false
  });

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

  const loadGuests = async () => {
    setLoading(true);
    try {
      const url = searchTerm 
        ? `${API_URL}?search=${encodeURIComponent(searchTerm)}`
        : API_URL;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setGuests(data.guests || []);
      }
    } catch (error) {
      console.error('Failed to load guests:', error);
    } finally {
      setLoading(false);
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
      }
    } catch (error) {
      console.error('Failed to load guest details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async () => {
    if (!formData.username || !formData.password || !formData.email || !formData.name) {
      alert('Заполните обязательные поля: логин, пароль, email, ФИО');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Гость создан!\nЛогин: ${formData.username}\nПароль: ${formData.password}`);
        setIsCreating(false);
        resetForm();
        await loadGuests();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create guest:', error);
      alert('Ошибка при создании гостя');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGuest = async () => {
    if (!selectedGuest) return;

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedGuest.id,
          ...formData
        })
      });

      if (response.ok) {
        alert('Данные гостя обновлены');
        setIsEditing(false);
        await loadGuests();
        if (selectedGuest) {
          await loadGuestDetails(selectedGuest.id);
        }
      } else {
        alert('Ошибка при обновлении');
      }
    } catch (error) {
      console.error('Failed to update guest:', error);
      alert('Ошибка при обновлении');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (guestId: number) => {
    if (!confirm('Удалить гостя? Это действие нельзя отменить.')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?id=${guestId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Гость удалён');
        setSelectedGuest(null);
        await loadGuests();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (error) {
      console.error('Failed to delete guest:', error);
      alert('Ошибка при удалении');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      name: '',
      phone: '',
      guest_type: 'regular',
      assigned_apartments: [],
      admin_notes: '',
      is_vip: false
    });
  };

  const startEdit = (guest: Guest) => {
    setFormData({
      username: guest.username || '',
      password: '',
      email: guest.email,
      name: guest.name,
      phone: guest.phone,
      guest_type: guest.guest_type,
      assigned_apartments: guest.assigned_apartments || [],
      admin_notes: guest.admin_notes || '',
      is_vip: guest.is_vip
    });
    setIsEditing(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} скопирован в буфер обмена`);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const handleSelectGuest = (guest: Guest) => {
    loadGuestDetails(guest.id);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    resetForm();
  };

  const togglePasswordVisibility = (key: number) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Управление гостями</h1>
            <Button onClick={handleLogout} variant="outline" className="text-white border-white/30">
              <Icon name="LogOut" size={16} />
              Выход
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск по имени, email, телефону, логину..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setIsCreating(true);
                setSelectedGuest(null);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Icon name="UserPlus" size={16} />
              Создать гостя
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {loading && guests.length === 0 ? (
              <div className="text-white text-center py-8">Загрузка...</div>
            ) : guests.length === 0 ? (
              <div className="text-white/60 text-center py-8">Гости не найдены</div>
            ) : (
              guests.map((guest) => (
                <GuestListItem
                  key={guest.id}
                  guest={guest}
                  onSelect={handleSelectGuest}
                  onCopy={copyToClipboard}
                />
              ))
            )}
          </div>

          <div>
            {(isCreating || isEditing) ? (
              <GuestFormModal
                isCreating={isCreating}
                isEditing={isEditing}
                formData={formData}
                apartmentCategories={apartmentCategories}
                loading={loading}
                showPassword={showPassword}
                onFormChange={setFormData}
                onSubmit={isCreating ? handleCreateGuest : handleUpdateGuest}
                onCancel={handleCancelForm}
                onTogglePassword={togglePasswordVisibility}
              />
            ) : selectedGuest ? (
              <GuestDetailsPanel
                guest={selectedGuest}
                apartmentCategories={apartmentCategories}
                showPassword={showPassword}
                onEdit={startEdit}
                onDelete={handleDeleteGuest}
                onCopy={copyToClipboard}
                onTogglePassword={togglePasswordVisibility}
              />
            ) : (
              <div className="bg-white/10 border-white/20 rounded-lg p-12 text-center">
                <Icon name="Users" size={64} className="mx-auto mb-4 text-white/20" />
                <h3 className="text-xl font-semibold text-white mb-2">Выберите гостя</h3>
                <p className="text-white/60">Выберите гостя из списка или создайте нового</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
