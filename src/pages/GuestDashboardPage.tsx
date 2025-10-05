import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Booking {
  id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
}

interface CheckInInstruction {
  title: string;
  description?: string;
  images: string[];
  instruction_text?: string;
  important_notes?: string;
  contact_info?: string;
  wifi_info?: string;
  parking_info?: string;
  house_rules?: string;
}

const GuestDashboardPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [instruction, setInstruction] = useState<CheckInInstruction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockBooking: Booking = {
      id: '1',
      apartment_id: '816',
      check_in: '2025-10-10',
      check_out: '2025-10-15',
      guest_name: 'Иван Иванов',
      guest_email: 'ivan@example.com',
      guest_phone: '+7 900 123-45-67',
    };

    const mockInstruction: CheckInInstruction = {
      title: 'Добро пожаловать в апартаменты 816!',
      description: 'Премиум апартаменты на 13 этаже с панорамным видом',
      images: [],
      instruction_text: `1. Подъезд находится со стороны парка
2. Войдите в главный вход, поднимитесь на 8 этаж
3. Апартаменты 816 находятся справа от лифта
4. Используйте код 1234 для входа`,
      important_notes: 'Тихий час с 22:00 до 08:00. Курение запрещено.',
      contact_info: 'Телефон администратора: +7 900 000-00-00\nEmail: info@poklonnaya9.ru',
      wifi_info: 'Сеть: Poklonnaya_Guest_816\nПароль: welcome2025',
      parking_info: 'Бесплатная парковка на подземном уровне -1. Въезд с торца здания.',
      house_rules: '• Не курить в помещении\n• Не шуметь после 22:00\n• Максимум 4 гостя\n• Домашние животные запрещены',
    };

    setTimeout(() => {
      setBooking(mockBooking);
      setInstruction(mockInstruction);
      setLoading(false);
    }, 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold font-playfair mb-2">Личный кабинет гостя</h1>
          <p className="text-gold-100">Вся информация о вашем бронировании</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="instruction">
                <Icon name="Info" size={16} className="mr-2" />
                Инструкция
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Icon name="Image" size={16} className="mr-2" />
                Фото
              </TabsTrigger>
              <TabsTrigger value="contacts">
                <Icon name="Phone" size={16} className="mr-2" />
                Контакты
              </TabsTrigger>
              <TabsTrigger value="rules">
                <Icon name="FileText" size={16} className="mr-2" />
                Правила
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
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default GuestDashboardPage;
