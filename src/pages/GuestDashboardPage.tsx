import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import GuestHeader from '@/components/guest/GuestHeader';
import LoyaltyCard from '@/components/guest/LoyaltyCard';
import CurrentBookingCard from '@/components/guest/CurrentBookingCard';
import BookingHistoryTab from '@/components/guest/BookingHistoryTab';
import InstructionTabs from '@/components/guest/InstructionTabs';

const API_URL = 'https://functions.poehali.dev/a629b99f-4972-4b9b-a55e-469c3d770ca7';
const BOOKINGS_API_URL = 'https://functions.poehali.dev/5fb527bf-818a-4b1a-b986-bd90154ba94b';
const PDF_API_URL = 'https://functions.poehali.dev/658336cf-3e08-480b-b90b-f72aa814a865';
const CANCEL_BOOKING_API_URL = 'https://functions.poehali.dev/edd37769-9243-46e7-997b-a12c73b0cae2';

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
        console.log('📋 Загружены бронирования для гостя:', user.email, bookingsData);
        
        if (bookingsData.success && bookingsData.bookings.length > 0) {
          setAllBookings(bookingsData.bookings);
          
          currentBooking = bookingsData.bookings.find((b: Booking) => 
            new Date(b.check_in) >= new Date()
          ) || bookingsData.bookings[0];
          
          console.log('🏠 Выбрано текущее бронирование:', currentBooking);
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
        console.log('🔍 Загружаю инструкции для apartment_id:', currentBooking.apartment_id);
        try {
          const response = await fetch(`${API_URL}?apartment_id=${currentBooking.apartment_id}`);
          const data = await response.json();
          console.log('📖 Получены инструкции:', data);
          
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
  const instructionTabsContent = instruction ? InstructionTabs({ instruction }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GuestHeader 
        guestName={guestUser?.name}
        guestEmail={guestUser?.email}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <LoyaltyCard bookingsCount={allBookings.length} />

        <CurrentBookingCard
          booking={booking}
          formatDate={formatDate}
          daysUntil={daysUntil}
          downloadingPdf={downloadingPdf}
          onDownloadPdf={downloadBookingPdf}
          cancellingBooking={cancellingBooking}
          onCancelBooking={handleCancelBooking}
        />

        {instruction && instructionTabsContent && (
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
              {instructionTabsContent.instruction}
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              {instructionTabsContent.photos}
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              {instructionTabsContent.documents}
            </TabsContent>

            <TabsContent value="contacts" className="mt-6">
              {instructionTabsContent.contacts}
            </TabsContent>

            <TabsContent value="rules" className="mt-6">
              {instructionTabsContent.rules}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <BookingHistoryTab
                bookings={allBookings}
                formatDate={formatDate}
                downloadingPdf={downloadingPdf}
                onDownloadPdf={downloadBookingPdf}
                cancellingBooking={cancellingBooking}
                onCancelBooking={handleCancelBooking}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default GuestDashboardPage;