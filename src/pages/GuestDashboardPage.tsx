import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';
const BOOKINGS_API_URL = 'https://functions.poehali.dev/5fb527bf-818a-4b1a-b986-bd90154ba94b';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  total_amount?: number;
  early_check_in?: number;
  late_check_out?: number;
  parking?: number;
  show_to_guest?: boolean;
  created_at?: string;
}

interface CheckInInstruction {
  title: string;
  description?: string;
  images: string[];
  pdf_files?: string[];
  instruction_text?: string;
  important_notes?: string;
  contact_info?: string;
  wifi_info?: string;
  parking_info?: string;
  house_rules?: string;
}

const GuestDashboardPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [instruction, setInstruction] = useState<CheckInInstruction | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestUser, setGuestUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const userStr = localStorage.getItem('guest_user');
      const token = localStorage.getItem('guest_token');
      
      if (!userStr || !token) {
        window.location.href = '/guest-login';
        return;
      }

      const user = JSON.parse(userStr);
      setGuestUser(user);

      try {
        const bookingsResponse = await fetch(BOOKINGS_API_URL, {
          method: 'GET',
          headers: {
            'X-User-Email': user.email
          }
        });
        
        const bookingsData = await bookingsResponse.json();
        
        if (bookingsData.success && bookingsData.bookings.length > 0) {
          setAllBookings(bookingsData.bookings);
          
          const upcomingBooking = bookingsData.bookings.find((b: Booking) => 
            new Date(b.check_in) >= new Date()
          ) || bookingsData.bookings[0];
          
          setBooking(upcomingBooking);
        } else {
          const mockBooking: Booking = {
            id: '1',
            apartment_id: '816',
            check_in: '2025-10-10',
            check_out: '2025-10-15',
            guest_name: user.name || 'Гость',
            guest_email: user.email,
            guest_phone: user.phone || '',
          };
          setBooking(mockBooking);
          setAllBookings([mockBooking]);
        }
      } catch (error) {
        console.error('Ошибка загрузки бронирований:', error);
        const mockBooking: Booking = {
          id: '1',
          apartment_id: '816',
          check_in: '2025-10-10',
          check_out: '2025-10-15',
          guest_name: user.name || 'Гость',
          guest_email: user.email,
          guest_phone: user.phone || '',
        };
        setBooking(mockBooking);
        setAllBookings([mockBooking]);
      }

      // Загружаем инструкции из базы данных
      try {
        const response = await fetch(`${API_URL}?apartment_id=${mockBooking.apartment_id}`);
        const data = await response.json();
        
        if (data) {
          setInstruction({
            title: data.title || 'Добро пожаловать!',
            description: data.description,
            images: data.images || [],
            pdf_files: data.pdf_files || [],
            instruction_text: data.instruction_text,
            important_notes: data.important_notes,
            contact_info: data.contact_info,
            wifi_info: data.wifi_info,
            parking_info: data.parking_info,
            house_rules: data.house_rules,
          });
        } else {
          // Если инструкций нет, показываем заглушку
          setInstruction({
            title: 'Добро пожаловать!',
            description: 'Инструкции по заселению скоро будут добавлены',
            images: [],
            pdf_files: [],
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки инструкций:', error);
        setInstruction({
          title: 'Добро пожаловать!',
          description: 'Инструкции по заселению скоро будут добавлены',
          images: [],
          pdf_files: [],
        });
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Icon name="AlertCircle" size={48} className="text-gold-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Бронирование не найдено</h2>
            <p className="text-gray-600">Проверьте ссылку или обратитесь к администратору</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysUntilCheckIn = () => {
    const checkIn = new Date(booking.check_in);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilCheckIn();

  const handleLogout = () => {
    localStorage.removeItem('guest_user');
    localStorage.removeItem('guest_token');
    window.location.href = '/guest-login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <a 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <span className="font-playfair font-bold text-white text-xs">Premium Apartments</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Icon name="LogOut" size={18} />
              <span className="text-sm font-medium">Выход</span>
            </button>
          </div>
          <div className="border-t border-white/20 pt-4">
            <h1 className="text-2xl font-bold font-playfair mb-1">Личный кабинет гостя</h1>
            <p className="text-gold-100 text-sm">
              {guestUser ? `Добро пожаловать, ${guestUser.name || guestUser.email}!` : 'Вся информация о вашем бронировании'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-t-4 border-t-gold-500">
          <CardHeader>
            <CardTitle className="text-2xl font-playfair">Ваш статус в программе лояльности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="Award" size={48} className="text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-playfair font-bold text-charcoal-900 mb-2">
                  Постоянник
                </h3>
                <p className="text-gray-700 mb-3">
                  У вас {allBookings.length} {allBookings.length === 1 ? 'бронирование' : allBookings.length < 5 ? 'бронирования' : 'бронирований'}
                </p>
                <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-2xl font-bold px-6 py-2 rounded-xl shadow-lg mb-4">
                  +10% к акциям
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Прогресс до статуса "Амбассадор"</span>
                    <span className="font-semibold text-charcoal-900">{allBookings.length}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-gold-500 to-gold-600 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${(allBookings.length / 10) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Осталось {Math.max(0, 10 - allBookings.length)} {Math.max(0, 10 - allBookings.length) === 1 ? 'бронирование' : 'бронирований'} до +15% к акциям
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="/loyalty-program"
                  className="inline-flex items-center gap-2 bg-white text-gold-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow border-2 border-gold-500"
                >
                  <Icon name="Trophy" size={18} />
                  Подробнее о программе
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-gold-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-playfair">Ваше бронирование</CardTitle>
              {daysUntil > 0 && (
                <Badge className="bg-gold-500 text-white">
                  Заезд через {daysUntil} {daysUntil === 1 ? 'день' : daysUntil < 5 ? 'дня' : 'дней'}
                </Badge>
              )}
              {daysUntil === 0 && (
                <Badge className="bg-green-500 text-white">Заезд сегодня!</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 mb-2">
                  <Icon name="Calendar" size={18} className="mr-2" />
                  <span className="font-semibold">Заезд</span>
                </div>
                <p className="text-lg text-charcoal-900">{formatDate(booking.check_in)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 mb-2">
                  <Icon name="Calendar" size={18} className="mr-2" />
                  <span className="font-semibold">Выезд</span>
                </div>
                <p className="text-lg text-charcoal-900">{formatDate(booking.check_out)}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600 mb-2">
                  <Icon name="Home" size={18} className="mr-2" />
                  <span className="font-semibold">Апартамент</span>
                </div>
                <p className="text-lg text-charcoal-900">№ {booking.apartment_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {instruction && (
          <Tabs defaultValue="instruction" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="instruction">
                <Icon name="Info" size={16} className="mr-2" />
                Инструкция
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Icon name="Image" size={16} className="mr-2" />
                Фото
              </TabsTrigger>
              <TabsTrigger value="documents">
                <Icon name="FileText" size={16} className="mr-2" />
                Документы
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <Icon name="Phone" size={16} className="mr-2" />
                Контакты
              </TabsTrigger>
              <TabsTrigger value="rules">
                <Icon name="BookOpen" size={16} className="mr-2" />
                Правила
              </TabsTrigger>
              <TabsTrigger value="history">
                <Icon name="History" size={16} className="mr-2" />
                История
              </TabsTrigger>
            </TabsList>

            <TabsContent value="instruction" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-playfair">{instruction.title}</CardTitle>
                  {instruction.description && (
                    <p className="text-gray-600 mt-2">{instruction.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {instruction.instruction_text && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Icon name="MapPin" size={20} className="mr-2 text-gold-500" />
                        Как добраться
                      </h3>
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {instruction.instruction_text}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {instruction.important_notes && (
                    <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2 flex items-center text-gold-900">
                        <Icon name="AlertCircle" size={20} className="mr-2" />
                        Важная информация
                      </h3>
                      <p className="text-gray-700">{instruction.important_notes}</p>
                    </div>
                  )}

                  {instruction.wifi_info && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Icon name="Wifi" size={20} className="mr-2 text-gold-500" />
                        Wi-Fi
                      </h3>
                      <p className="whitespace-pre-wrap text-gray-700 font-mono bg-gray-50 p-3 rounded">
                        {instruction.wifi_info}
                      </p>
                    </div>
                  )}

                  {instruction.parking_info && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center">
                        <Icon name="Car" size={20} className="mr-2 text-gold-500" />
                        Парковка
                      </h3>
                      <p className="text-gray-700">{instruction.parking_info}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Фотографии апартамента</CardTitle>
                </CardHeader>
                <CardContent>
                  {instruction.images && instruction.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {instruction.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Апартамент ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Фотографии скоро появятся</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Документы и инструкции</CardTitle>
                </CardHeader>
                <CardContent>
                  {instruction.pdf_files && instruction.pdf_files.length > 0 ? (
                    <div className="space-y-3">
                      {instruction.pdf_files.map((pdf, idx) => (
                        <a
                          key={idx}
                          href={pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <Icon name="FileText" size={24} className="text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Документ {idx + 1}</p>
                            <p className="text-sm text-gray-500 truncate">{pdf}</p>
                          </div>
                          <Icon name="Download" size={20} className="text-gray-400 group-hover:text-gold-500 transition-colors" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Документы пока не добавлены</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {instruction.contact_info ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-start">
                        <Icon name="Phone" size={24} className="mr-4 text-gold-500 mt-1" />
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Связаться с нами</h3>
                          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {instruction.contact_info}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Контактная информация появится позже
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Правила проживания</CardTitle>
                </CardHeader>
                <CardContent>
                  {instruction.house_rules ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {instruction.house_rules}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Правила проживания появятся позже
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>История бронирований</CardTitle>
                </CardHeader>
                <CardContent>
                  {allBookings.length > 0 ? (
                    <div className="space-y-4">
                      {allBookings.map((b) => {
                        const checkInDate = new Date(b.check_in);
                        const checkOutDate = new Date(b.check_out);
                        const today = new Date();
                        const isPast = checkOutDate < today;
                        const isUpcoming = checkInDate > today;
                        const isCurrent = checkInDate <= today && checkOutDate >= today;

                        return (
                          <div
                            key={b.id}
                            className={`p-6 rounded-lg border-2 transition-all ${
                              isCurrent
                                ? 'bg-green-50 border-green-300'
                                : isUpcoming
                                ? 'bg-blue-50 border-blue-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-charcoal-900 mb-1">
                                  Апартамент № {b.apartment_id}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {isCurrent && (
                                    <Badge className="bg-green-500">Текущее</Badge>
                                  )}
                                  {isUpcoming && (
                                    <Badge className="bg-blue-500">Предстоящее</Badge>
                                  )}
                                  {isPast && (
                                    <Badge variant="outline">Завершено</Badge>
                                  )}
                                </div>
                              </div>
                              {b.total_amount && (
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-gold-600">
                                    {b.total_amount.toLocaleString('ru-RU')} ₽
                                  </p>
                                  <p className="text-xs text-gray-500">Стоимость</p>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                  <Icon name="Calendar" size={20} className="text-gold-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Заезд</p>
                                  <p className="font-semibold text-charcoal-900">
                                    {formatDate(b.check_in)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                  <Icon name="Calendar" size={20} className="text-gold-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Выезд</p>
                                  <p className="font-semibold text-charcoal-900">
                                    {formatDate(b.check_out)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {(b.early_check_in || b.late_check_out || b.parking) && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">Дополнительно:</p>
                                <div className="flex flex-wrap gap-2">
                                  {b.early_check_in && b.early_check_in > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <Icon name="Clock" size={12} className="mr-1" />
                                      Ранний заезд
                                    </Badge>
                                  )}
                                  {b.late_check_out && b.late_check_out > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <Icon name="Clock" size={12} className="mr-1" />
                                      Поздний выезд
                                    </Badge>
                                  )}
                                  {b.parking && b.parking > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      <Icon name="Car" size={12} className="mr-1" />
                                      Парковка
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>У вас пока нет бронирований</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default GuestDashboardPage;