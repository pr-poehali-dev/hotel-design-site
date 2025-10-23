import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

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
      
      // Загружаем полные данные гостя
      const guestResponse = await fetch(`${GUEST_API_URL}?id=${user.id}`);
      if (guestResponse.ok) {
        const guestData = await guestResponse.json();
        setGuestUser(guestData);
        setProfileForm({
          name: guestData.name || '',
          phone: guestData.phone || '',
          password: ''
        });
        
        // Брони из ответа guest API
        if (guestData.bookings) {
          setBookings(guestData.bookings);
        }
      } else {
        // Fallback на старый формат
        setGuestUser(user);
        
        // Загружаем брони старым способом
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

  const getBookingStatus = (booking: Booking) => {
    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);
    const today = new Date();

    if (checkOutDate < today) return 'completed';
    if (checkInDate <= today && checkOutDate >= today) return 'active';
    return 'upcoming';
  };

  const activeBookings = bookings.filter(b => ['active', 'upcoming'].includes(getBookingStatus(b)));
  const pastBookings = bookings.filter(b => getBookingStatus(b) === 'completed');

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
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Добро пожаловать, {guestUser.name}!
              </h1>
              <div className="flex gap-2">
                {guestUser.is_vip && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full">
                    ⭐ VIP
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
                  {guestUser.total_bookings} {guestUser.total_bookings === 1 ? 'бронь' : 'броней'}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Icon name="LogOut" size={16} />
              Выход
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'bookings'
                  ? 'text-white bg-white/10 border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name="Calendar" size={16} className="inline mr-2" />
              Мои брони
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-white bg-white/10 border-b-2 border-purple-500'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name="User" size={16} className="inline mr-2" />
              Профиль
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'bookings' ? (
          <div className="space-y-8">
            {/* Active/Upcoming Bookings */}
            {activeBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Активные и предстоящие</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {activeBookings.map((booking) => {
                    const status = getBookingStatus(booking);
                    const daysUntil = getDaysUntil(booking.check_in);
                    
                    return (
                      <Card key={booking.id} className="bg-white/10 border-white/20 p-6 hover:bg-white/15 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {booking.apartment_name || booking.room_number || `Апартамент ${booking.apartment_id}`}
                            </h3>
                            {status === 'active' ? (
                              <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                <Icon name="CheckCircle" size={12} className="mr-1" />
                                Активная бронь
                              </span>
                            ) : daysUntil <= 7 ? (
                              <span className="inline-flex items-center px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded">
                                <Icon name="Clock" size={12} className="mr-1" />
                                Через {daysUntil} {daysUntil === 1 ? 'день' : 'дней'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                                <Icon name="Calendar" size={12} className="mr-1" />
                                Предстоящая
                              </span>
                            )}
                          </div>
                          {booking.total_amount && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-white">{booking.total_amount.toLocaleString()} ₽</div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-white/80">
                            <Icon name="Calendar" size={16} className="mr-2 text-purple-400" />
                            <span className="text-sm">
                              {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                            </span>
                          </div>

                          <div className="flex items-center text-white/80">
                            <Icon name="Clock" size={16} className="mr-2 text-purple-400" />
                            <span className="text-sm">
                              {Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))} ночей
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                            onClick={() => window.open(`https://reservationsteps.ru/`, '_blank')}
                          >
                            <Icon name="ExternalLink" size={14} />
                            Детали брони
                          </Button>
                          {status === 'upcoming' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-white border-white/30 hover:bg-white/10"
                            >
                              <Icon name="RotateCcw" size={14} />
                              Повторить
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">История бронирований</h2>
                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="bg-white/5 border-white/10 p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">
                            {booking.apartment_name || booking.room_number || `Апартамент ${booking.apartment_id}`}
                          </h4>
                          <div className="text-sm text-white/60">
                            {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                          </div>
                        </div>
                        {booking.total_amount && (
                          <div className="text-white font-medium mr-4">
                            {booking.total_amount.toLocaleString()} ₽
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-white border-white/30 hover:bg-white/10"
                        >
                          <Icon name="RotateCcw" size={14} />
                          Повторить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {bookings.length === 0 && (
              <Card className="bg-white/5 border-white/10 p-12">
                <div className="text-center">
                  <Icon name="Calendar" size={64} className="mx-auto mb-4 text-white/20" />
                  <h3 className="text-xl font-semibold text-white mb-2">У вас пока нет бронирований</h3>
                  <p className="text-white/60 mb-6">Забронируйте свой первый апартамент!</p>
                  <Button 
                    onClick={() => navigate('/')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="Search" size={16} />
                    Выбрать апартамент
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Мой профиль</h2>

              {!editingProfile ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">ФИО</div>
                    <div className="text-white font-medium">{guestUser.name}</div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Email</div>
                    <div className="text-white">{guestUser.email}</div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Телефон</div>
                    <div className="text-white">{guestUser.phone || 'Не указан'}</div>
                  </div>

                  {guestUser.username && (
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="text-white/60 text-sm mb-1">Логин</div>
                      <div className="text-white">{guestUser.username}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="text-purple-300 text-sm mb-1">Всего броней</div>
                      <div className="text-white text-2xl font-bold">{guestUser.total_bookings}</div>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="text-green-300 text-sm mb-1">Потрачено</div>
                      <div className="text-white text-2xl font-bold">{parseFloat(guestUser.total_spent).toLocaleString()} ₽</div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setEditingProfile(true)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="Edit" size={16} />
                    Редактировать профиль
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm mb-2 block">ФИО</label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">Телефон</label>
                    <Input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+7 999 123-45-67"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white text-sm mb-2 block">
                      Новый пароль (оставьте пустым, чтобы не менять)
                    </label>
                    <Input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleUpdateProfile}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Icon name="Check" size={16} />
                      Сохранить
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditingProfile(false);
                        setProfileForm({
                          name: guestUser.name,
                          phone: guestUser.phone,
                          password: ''
                        });
                      }}
                      variant="outline"
                      className="flex-1 text-white border-white/30"
                    >
                      <Icon name="X" size={16} />
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
