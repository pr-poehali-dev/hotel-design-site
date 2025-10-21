import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import MonthCalendar from '@/components/booking/MonthCalendar';

interface Apartment {
  id: number;
  name: string;
  price?: number;
  bnovo_id?: number;
}

interface AvailabilityData {
  [apartmentId: string]: {
    [date: string]: {
      price?: number;
      available: boolean;
    };
  };
}

const BookingSection = () => {
  const { toast } = useToast();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [availability, setAvailability] = useState<AvailabilityData>({});
  const [loading, setLoading] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    loadApartments();
    loadAvailability();
  }, []);

  const loadApartments = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7cb67a25-c7f6-4902-8274-277a31ef2bcf');
      const data = await response.json();
      if (data.apartments) {
        setApartments(data.apartments);
        if (data.apartments.length > 0) {
          setSelectedApartment(data.apartments[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to load apartments:', error);
    }
  };

  const loadAvailability = async () => {
    console.log('🔄 Starting to load availability...');
    try {
      const url = `https://functions.poehali.dev/c8a4acdb-ddbe-41e1-b4d8-a6e6055be8c6?t=${Date.now()}`;
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url);
      console.log('📦 Response status:', response.status);
      
      const data = await response.json();
      console.log('✅ Availability data loaded:', data);
      console.log('🏠 Apartment 2019 availability:', data.availability?.['2019']);
      
      if (data.availability) {
        setAvailability(data.availability);
        console.log('💾 Availability set to state');
      } else {
        console.warn('⚠️ No availability data in response');
      }
    } catch (error) {
      console.error('❌ Failed to load availability:', error);
    }
  };

  const getCurrentPrice = () => {
    if (!selectedApartment || !checkIn) {
      const apt = apartments.find(a => a.id.toString() === selectedApartment);
      return apt?.price || 0;
    }

    const aptAvailability = availability[selectedApartment];
    if (aptAvailability && aptAvailability[checkIn]) {
      return aptAvailability[checkIn].price || 0;
    }

    const apt = apartments.find(a => a.id.toString() === selectedApartment);
    return apt?.price || 0;
  };

  const isDateDisabled = (date: string) => {
    if (!selectedApartment) return false;
    const aptAvailability = availability[selectedApartment];
    if (!aptAvailability) return false;
    return aptAvailability[date]?.available === false;
  };

  const handleCalendarDateSelect = (date: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut('');
    } else if (checkIn && !checkOut) {
      if (date < checkIn) {
        setCheckIn(date);
        setCheckOut('');
      } else {
        setCheckOut(date);
      }
    }
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !selectedApartment) return 0;
    
    const apt = apartments.find(a => a.id.toString() === selectedApartment);
    const defaultPrice = apt?.price || 8500;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    let total = 0;
    const current = new Date(start);
    
    while (current < end) {
      const dateStr = current.toISOString().split('T')[0];
      const aptAvailability = availability[selectedApartment];
      const dayPrice = (aptAvailability && aptAvailability[dateStr]?.price) || defaultPrice;
      total += dayPrice;
      current.setDate(current.getDate() + 1);
    }
    
    return total;
  };

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut || !selectedApartment) {
      toast({
        title: 'Заполните все поля',
        description: 'Укажите даты и выберите апартаменты',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast({
        title: 'Некорректные даты',
        description: 'Дата выезда должна быть позже даты заезда',
        variant: 'destructive',
      });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date(checkInDate);

    while (currentDate < checkOutDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (isDateDisabled(dateStr)) {
        toast({
          title: 'Даты недоступны',
          description: `${dateStr} уже забронирован`,
          variant: 'destructive',
        });
        return;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      toast({
        title: 'Заполните контактные данные',
        description: 'Укажите имя, email и телефон',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/5a3ff68a-6bba-444f-a0a4-7dd5e4569530', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apartment_id: selectedApartment,
          check_in: checkIn,
          check_out: checkOut,
          guest_name: contactInfo.name,
          guest_email: contactInfo.email,
          guest_phone: contactInfo.phone,
          adults: guests.adults,
          children: guests.children,
          source: 'website',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Бронирование создано!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });

        setCheckIn('');
        setCheckOut('');
        setContactInfo({ name: '', email: '', phone: '' });
        setGuests({ adults: 2, children: 0 });
        loadAvailability();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать бронирование',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-50 to-gold-50">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
              <span className="text-gold-500">Бронирование</span> Апартаментов
            </h2>
            <p className="text-xl text-charcoal-600 font-inter">
              Забронируйте ваши идеальные апартаменты прямо сейчас
            </p>
          </div>

          <Card className="p-8 shadow-2xl border-0 bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                    Дата заезда
                  </label>
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={minDate}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      checkIn && isDateDisabled(checkIn) 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                        : 'border-charcoal-200 focus:border-gold-500 focus:ring-gold-200'
                    }`}
                    required
                  />
                  {checkIn && isDateDisabled(checkIn) && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={14} />
                      Эта дата занята
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                    Дата выезда
                  </label>
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || minDate}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-all ${
                      checkOut && isDateDisabled(checkOut) 
                        ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200' 
                        : 'border-charcoal-200 focus:border-gold-500 focus:ring-gold-200'
                    }`}
                    required
                  />
                  {checkOut && isDateDisabled(checkOut) && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={14} />
                      Эта дата занята
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                  Тип апартаментов
                </label>
                <select
                  value={selectedApartment}
                  onChange={(e) => setSelectedApartment(e.target.value)}
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  required
                >
                  {apartments.map((apt) => (
                    <option key={apt.id} value={apt.id}>
                      {apt.name} - {getCurrentPrice().toLocaleString('ru-RU')} ₽
                    </option>
                  ))}
                </select>
              </div>

              {selectedApartment && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-charcoal-900 flex items-center gap-2">
                      <Icon name="Calendar" size={20} />
                      Выберите даты
                    </h3>
                    <button
                      type="button"
                      onClick={loadAvailability}
                      className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1 transition-colors"
                    >
                      <Icon name="RefreshCw" size={16} />
                      Обновить
                    </button>
                  </div>
                  <MonthCalendar
                    selectedApartment={selectedApartment}
                    availability={availability}
                    onDateSelect={handleCalendarDateSelect}
                    selectedDates={{ checkIn, checkOut }}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                    Взрослые
                  </label>
                  <select
                    value={guests.adults}
                    onChange={(e) => setGuests({ ...guests, adults: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                    Дети
                  </label>
                  <select
                    value={guests.children}
                    onChange={(e) => setGuests({ ...guests, children: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                  Имя
                </label>
                <input 
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="Ваше полное имя"
                  required
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                  Email
                </label>
                <input 
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">
                  Телефон
                </label>
                <input 
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>

              {checkIn && checkOut && selectedApartment && (
                <div className="bg-gradient-to-r from-gold-50 to-gold-100 border-2 border-gold-300 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Wallet" size={24} className="text-gold-600" />
                      <span className="text-charcoal-900 font-bold text-lg">Итоговая стоимость</span>
                    </div>
                    <span className="text-3xl font-bold text-gold-600">
                      {calculateTotalPrice().toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-charcoal-600">
                    <div className="flex items-center gap-1">
                      <Icon name="Moon" size={16} />
                      <span>{getNights()} {getNights() === 1 ? 'ночь' : getNights() < 5 ? 'ночи' : 'ночей'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Users" size={16} />
                      <span>{guests.adults + guests.children} {guests.adults + guests.children === 1 ? 'гость' : 'гостей'}</span>
                    </div>
                  </div>
                </div>
              )}

              <FizzyButton 
                type="submit"
                className="w-full"
                disabled={loading}
                icon={<Icon name="Calendar" size={20} />}
              >
                {loading ? 'Отправка...' : 'Забронировать апартаменты'}
              </FizzyButton>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;