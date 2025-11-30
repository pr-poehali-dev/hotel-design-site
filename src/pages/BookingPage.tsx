import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, eachDayOfInterval, isBefore, startOfDay } from 'date-fns';
import Header from '@/components/sections/Header';
import BookingCalendar from '@/components/booking/BookingCalendar';
import BookingForm from '@/components/booking/BookingForm';
import BookingList from '@/components/booking/BookingList';

interface AvailabilityDay {
  date: string;
  is_available: boolean;
  price?: number;
  booking_id?: string;
  guest_name?: string;
}

interface Calendar {
  room_id: string;
  room_name: string;
  days: AvailabilityDay[];
}

interface RoomDetails {
  price_per_night: number;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');
  
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [adults, setAdults] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!roomId) {
      window.location.href = '/';
      return;
    }

    const fetchCalendar = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/cb06df00-bb06-4e01-a02d-f31057ae60af`);
        const data = await response.json();
        console.log('Все календари:', data.calendars);
        console.log('Ищем roomId:', roomId);
        const roomCalendar = data.calendars.find((cal: Calendar) => cal.room_id === roomId);
        console.log('Найденный календарь:', roomCalendar);
        
        if (roomCalendar) {
          setCalendar(roomCalendar);
        } else {
          console.error('Календарь для данного апартамента не найден');
          console.log('Доступные room_id:', data.calendars.map((c: Calendar) => c.room_id));
        }
      } catch (error) {
        console.error('Ошибка загрузки календаря:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRoomDetails = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/7cb67a25-c7f6-4902-8274-277a31ef2bcf`);
        const data = await response.json();
        if (data.apartments && data.apartments.length > 0) {
          const room = data.apartments.find((apt: any) => apt.id === roomId);
          if (room) {
            setRoomDetails({ price_per_night: room.price || 0 });
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки деталей апартамента:', error);
      }
    };

    fetchCalendar();
    fetchRoomDetails();
  }, [roomId]);

  const isDateAvailable = (date: Date): boolean => {
    if (!calendar) return false;
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendar.days.find(d => d.date === dateStr);
    return dayData ? dayData.is_available : true;
  };

  const handleDateClick = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return;
    if (!isDateAvailable(date)) return;

    if (!checkInDate) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (!checkOutDate) {
      if (isBefore(date, checkInDate)) {
        setCheckInDate(date);
        setCheckOutDate(null);
      } else {
        const allAvailable = eachDayOfInterval({ start: checkInDate, end: date })
          .every(d => isDateAvailable(d));
        
        if (allAvailable) {
          setCheckOutDate(date);
        } else {
          setCheckInDate(date);
          setCheckOutDate(null);
        }
      }
    } else {
      setCheckInDate(date);
      setCheckOutDate(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) return;

    setSubmitting(true);
    
    const bookingData = {
      apartment_id: roomId,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      check_in: format(checkInDate, 'yyyy-MM-dd'),
      check_out: format(checkOutDate, 'yyyy-MM-dd'),
      adults: adults,
      children: 0,
      source: 'website'
    };
    
    console.log('🚀 Отправка бронирования:', bookingData);
    console.log('📡 URL:', 'https://functions.poehali.dev/5a3ff68a-6bba-444f-a0a4-7dd5e4569530');
    
    try {
      const response = await fetch('https://functions.poehali.dev/5a3ff68a-6bba-444f-a0a4-7dd5e4569530', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        alert('Бронирование успешно создано! Апартамент забронирован на выбранные даты.');
        window.location.href = '/';
      } else {
        const error = await response.json();
        console.error('Ошибка от сервера:', error);
        alert(`Ошибка: ${error.error || 'Не удалось создать бронирование'}`);
      }
    } catch (error) {
      console.error('Ошибка создания бронирования:', error);
      alert('Ошибка создания бронирования. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl text-white mb-4">Апартамент не найден</h1>
          <p className="text-gray-400 mb-6">Календарь для данного апартамента не найден. Возможно, roomId указан неверно.</p>
          <p className="text-gray-500 text-sm mb-4">Искали roomId: {roomId}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-semibold transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Бронирование апартамента
          </h1>
          <p className="text-gold-400 text-lg">
            {calendar.room_name}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <BookingCalendar
            calendar={calendar}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            handleDateClick={handleDateClick}
          />

          <div>
            <BookingForm
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              roomDetails={roomDetails}
              guestName={guestName}
              setGuestName={setGuestName}
              guestEmail={guestEmail}
              setGuestEmail={setGuestEmail}
              guestPhone={guestPhone}
              setGuestPhone={setGuestPhone}
              adults={adults}
              setAdults={setAdults}
              submitting={submitting}
              handleSubmit={handleSubmit}
            />

            <BookingList calendar={calendar} />
          </div>
        </div>
      </div>
    </div>
  );
}
