import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AdminLogin from '@/components/AdminLogin';

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

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Управление гостями</h1>
            <Button onClick={handleLogout} variant="outline" className="text-white border-white/30">
              <Icon name="LogOut" size={16} />
              Выход
            </Button>
          </div>

          {/* Search and Actions */}
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
          {/* Guests List */}
          <div className="space-y-3">
            {loading && guests.length === 0 ? (
              <div className="text-white text-center py-8">Загрузка...</div>
            ) : guests.length === 0 ? (
              <div className="text-white/60 text-center py-8">Гости не найдены</div>
            ) : (
              guests.map((guest) => (
                <Card
                  key={guest.id}
                  onClick={() => loadGuestDetails(guest.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedGuest?.id === guest.id
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{guest.name}</h3>
                        {guest.is_vip && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/70">{guest.email}</p>
                      <p className="text-sm text-white/70">{guest.phone}</p>
                      {guest.username && (
                        <p className="text-xs text-white/50 mt-1">Логин: {guest.username}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/70">
                        Броней: {guest.total_bookings}
                      </div>
                      <div className="text-sm text-white/70">
                        {guest.total_spent} ₽
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Guest Details / Create Form */}
          <div>
            {isCreating ? (
              <Card className="bg-white/10 border-white/20 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Новый гость</h2>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Логин *</label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        placeholder="ivanov"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Пароль *</label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">ФИО *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Иванов Иван Иванович"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="guest@example.com"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm mb-2 block">Телефон</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+7 999 123-45-67"
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">Тип гостя</label>
                    <select
                      value={formData.guest_type}
                      onChange={(e) => setFormData({...formData, guest_type: e.target.value})}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md"
                    >
                      <option value="regular">Обычный</option>
                      <option value="vip">VIP</option>
                      <option value="corporate">Корпоративный</option>
                      <option value="blacklist">Чёрный список</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_vip}
                        onChange={(e) => setFormData({...formData, is_vip: e.target.checked})}
                        className="w-4 h-4"
                      />
                      VIP статус
                    </label>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">Доступные категории апартаментов</label>
                    <div className="grid grid-cols-2 gap-2">
                      {apartmentCategories.map((apt) => (
                        <label key={apt.id} className="flex items-center gap-2 text-white text-sm">
                          <input
                            type="checkbox"
                            checked={formData.assigned_apartments.includes(apt.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  assigned_apartments: [...formData.assigned_apartments, apt.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  assigned_apartments: formData.assigned_apartments.filter(id => id !== apt.id)
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          {apt.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">Заметки администратора</label>
                    <textarea
                      value={formData.admin_notes}
                      onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                      placeholder="Внутренние заметки о госте..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleCreateGuest} disabled={loading} className="bg-green-600 hover:bg-green-700">
                      <Icon name="Check" size={16} />
                      Создать
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsCreating(false);
                        resetForm();
                      }} 
                      variant="outline"
                      className="text-white border-white/30"
                    >
                      <Icon name="X" size={16} />
                      Отмена
                    </Button>
                  </div>
                </div>
              </Card>
            ) : selectedGuest ? (
              <Card className="bg-white/10 border-white/20 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedGuest.name}</h2>
                    <div className="flex gap-2">
                      {selectedGuest.is_vip && (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded">
                          VIP
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded">
                        {selectedGuest.guest_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => startEdit(selectedGuest)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Icon name="Edit" size={14} />
                      Редактировать
                    </Button>
                    <Button 
                      onClick={() => handleDeleteGuest(selectedGuest.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4 border-t border-white/20 pt-6">
                    <h3 className="text-white font-semibold">Редактирование данных</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm mb-2 block">Логин</label>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Новый пароль (оставьте пустым, чтобы не менять)</label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••"
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm mb-2 block">ФИО</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm mb-2 block">Телефон</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm mb-2 block">Доступные категории</label>
                      <div className="grid grid-cols-2 gap-2">
                        {apartmentCategories.map((apt) => (
                          <label key={apt.id} className="flex items-center gap-2 text-white text-sm">
                            <input
                              type="checkbox"
                              checked={formData.assigned_apartments.includes(apt.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    assigned_apartments: [...formData.assigned_apartments, apt.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    assigned_apartments: formData.assigned_apartments.filter(id => id !== apt.id)
                                  });
                                }
                              }}
                              className="w-4 h-4"
                            />
                            {apt.name}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm mb-2 block">Заметки</label>
                      <textarea
                        value={formData.admin_notes}
                        onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-md"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={handleUpdateGuest} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        <Icon name="Check" size={16} />
                        Сохранить
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)} 
                        variant="outline"
                        className="text-white border-white/30"
                      >
                        <Icon name="X" size={16} />
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                        <div>
                          <div className="text-white/60 text-sm">Логин</div>
                          <div className="text-white font-medium">{selectedGuest.username || 'Не задан'}</div>
                        </div>
                        {selectedGuest.username && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(selectedGuest.username!, 'Логин')}
                            className="text-white border-white/30"
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                        <div>
                          <div className="text-white/60 text-sm">Email</div>
                          <div className="text-white">{selectedGuest.email}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(selectedGuest.email, 'Email')}
                          className="text-white border-white/30"
                        >
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>

                      <div className="p-3 bg-white/5 rounded">
                        <div className="text-white/60 text-sm">Телефон</div>
                        <div className="text-white">{selectedGuest.phone || 'Не указан'}</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded">
                        <div className="text-white/60 text-sm">Статистика</div>
                        <div className="text-white">
                          Броней: {selectedGuest.total_bookings} | Потрачено: {selectedGuest.total_spent} ₽
                        </div>
                      </div>

                      {selectedGuest.admin_notes && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                          <div className="text-yellow-300 text-sm mb-1">Заметки администратора</div>
                          <div className="text-white text-sm">{selectedGuest.admin_notes}</div>
                        </div>
                      )}
                    </div>

                    {/* Bookings */}
                    <div className="border-t border-white/20 pt-6">
                      <h3 className="text-white font-semibold mb-4">История бронирований ({selectedGuest.bookings?.length || 0})</h3>
                      
                      {selectedGuest.bookings && selectedGuest.bookings.length > 0 ? (
                        <div className="space-y-3">
                          {selectedGuest.bookings.map((booking: any) => (
                            <div key={booking.id} className="p-3 bg-white/5 rounded">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="text-white font-medium">{booking.apartment_name || booking.room_number}</div>
                                  <div className="text-white/60 text-sm">
                                    {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-white font-medium">{booking.total_amount} ₽</div>
                                  <div className="text-white/60 text-xs">{booking.status}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-white/60 text-center py-8">Бронирований пока нет</div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            ) : (
              <Card className="bg-white/10 border-white/20 p-12">
                <div className="text-center text-white/60">
                  <Icon name="Users" size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Выберите гостя из списка или создайте нового</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
