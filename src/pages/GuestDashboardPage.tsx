import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import GuestHeader from '@/components/guest/GuestHeader';
import LoyaltyCard from '@/components/guest/LoyaltyCard';
import CurrentBookingCard from '@/components/guest/CurrentBookingCard';
import BookingHistoryTab from '@/components/guest/BookingHistoryTab';

const BOOKINGS_API_URL = 'https://functions.poehali.dev/5fb527bf-818a-4b1a-b986-bd90154ba94b';
const PDF_API_URL = 'https://functions.poehali.dev/658336cf-3e08-480b-b90b-f72aa814a865';
const CANCEL_BOOKING_API_URL = 'https://functions.poehali.dev/edd37769-9243-46e7-997b-a12c73b0cae2';
const INSTRUCTIONS_API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';

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
  status?: string;
}

interface Instruction {
  images: string[];
}

const GuestDashboardPage = () => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [instruction, setInstruction] = useState<Instruction | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestUser, setGuestUser] = useState<any>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

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

      let currentBooking: Booking | null = null;

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
          
          currentBooking = bookingsData.bookings.find((b: Booking) => 
            new Date(b.check_in) >= new Date()
          ) || bookingsData.bookings[0];
          
          setBooking(currentBooking);
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
          currentBooking = mockBooking;
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
        currentBooking = mockBooking;
        setBooking(mockBooking);
        setAllBookings([mockBooking]);
      }

      if (currentBooking) {
        try {
          const response = await fetch(`${INSTRUCTIONS_API_URL}?apartment_id=${currentBooking.apartment_id}`);
          const data = await response.json();
          
          if (data && data.images) {
            setInstruction({ images: data.images });
          }
        } catch (error) {
          console.error('Ошибка загрузки инструкций:', error);
        }
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getDaysUntilCheckIn = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.check_in);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLogout = () => {
    localStorage.removeItem('guest_user');
    localStorage.removeItem('guest_token');
    window.location.href = '/guest-login';
  };

  const downloadBookingPdf = async (bookingId: string) => {
    if (!guestUser) return;
    
    setDownloadingPdf(bookingId);
    
    try {
      const response = await fetch(PDF_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          guest_email: guestUser.email
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const linkSource = `data:application/pdf;base64,${data.pdf}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = data.filename || `booking_${bookingId}.pdf`;
        downloadLink.click();
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось создать PDF'));
      }
    } catch (error) {
      alert('Не удалось скачать подтверждение');
    } finally {
      setDownloadingPdf(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!guestUser) return;
    
    const confirmed = window.confirm('Вы уверены, что хотите отменить это бронирование?');
    if (!confirmed) return;
    
    setCancellingBooking(bookingId);
    
    try {
      const response = await fetch(CANCEL_BOOKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          guest_email: guestUser.email
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Бронирование успешно отменено');
        
        setAllBookings(prev => 
          prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
        );
        
        if (booking?.id === bookingId) {
          setBooking(prev => prev ? { ...prev, status: 'cancelled' } : null);
        }
      } else {
        alert('Ошибка: ' + (data.error || 'Не удалось отменить бронирование'));
      }
    } catch (error) {
      alert('Не удалось отменить бронирование');
    } finally {
      setCancellingBooking(null);
    }
  };

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
        <div className="max-w-md text-center p-6">
          <Icon name="AlertCircle" size={48} className="text-gold-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Бронирование не найдено</h2>
          <p className="text-gray-600">Проверьте ссылку или обратитесь к администратору</p>
        </div>
      </div>
    );
  }

  const daysUntil = getDaysUntilCheckIn();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GuestHeader 
        guestName={guestUser?.name}
        guestEmail={guestUser?.email}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8 space-y-4 md:space-y-6">
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <LoyaltyCard bookingsCount={allBookings.length} />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <CurrentBookingCard
            booking={booking}
            formatDate={formatDate}
            daysUntil={daysUntil}
            downloadingPdf={downloadingPdf}
            onDownloadPdf={downloadBookingPdf}
            cancellingBooking={cancellingBooking}
            onCancelBooking={handleCancelBooking}
          />
        </div>

        {instruction && instruction.images && instruction.images.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Card className="shadow-lg">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                  <Icon name="Image" size={18} className="text-gold-600 md:w-5 md:h-5" />
                  Фотографии апартамента
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {instruction.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="animate-in fade-in zoom-in-95 duration-500"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <img
                        src={img}
                        alt={`Апартамент ${idx + 1}`}
                        className="w-full h-36 md:h-48 object-cover rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                        onClick={() => window.open(img, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
          <Card className="shadow-lg">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-2xl">
                <Icon name="History" size={18} className="text-gold-600 md:w-5 md:h-5" />
                История бронирований
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BookingHistoryTab
                bookings={allBookings}
                formatDate={formatDate}
                downloadingPdf={downloadingPdf}
                onDownloadPdf={downloadBookingPdf}
                cancellingBooking={cancellingBooking}
                onCancelBooking={handleCancelBooking}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboardPage;