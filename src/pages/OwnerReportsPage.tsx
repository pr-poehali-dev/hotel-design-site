import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BookingRecord } from '@/types/booking';
import Icon from '@/components/ui/icon';

export default function OwnerReportsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [ownerInfo, setOwnerInfo] = useState<{ ownerName: string; ownerEmail: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    if (!token) {
      navigate('/owner-login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!apartmentId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5?apartment_id=${apartmentId}`);
        if (response.ok) {
          const info = await response.json();
          setOwnerInfo(info);
        }

        const bookingsResponse = await fetch(`https://functions.poehali.dev/42f08a7b-0e59-4277-b467-1ceb942afe5e?apartment_id=${apartmentId}`);
        if (bookingsResponse.ok) {
          const data = await bookingsResponse.json();
          const filteredBookings = (data || []).filter((b: any) => b.showToGuest);
          setBookings(filteredBookings);
        }
      } catch (err) {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apartmentId]);

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerId');
    navigate('/owner-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 flex items-center justify-center p-4">
        <Card className="bg-red-500/10 border-red-500 p-6 max-w-md">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Ошибка</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gold-500 text-charcoal-900 rounded-lg font-semibold"
            >
              Обновить
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const totalAmount = bookings.reduce((sum, b) => sum + (b.ownerFunds || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      {/* Header */}
      <div className="bg-charcoal-900 border-b border-gold-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-charcoal-900">P9</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Апартамент {apartmentId}</h1>
                {ownerInfo && <p className="text-xs text-gray-400">{ownerInfo.ownerName}</p>}
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-charcoal-800 rounded-lg">
              <Icon name="LogOut" size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-gold-500 to-gold-600 border-0 p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-charcoal-900/80 mb-2">Итого к получению</p>
            <p className="text-4xl font-bold text-charcoal-900">{totalAmount.toLocaleString('ru')} ₽</p>
          </div>
        </Card>

        {bookings.length === 0 ? (
          <Card className="p-8 text-center">
            <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Нет данных о бронированиях</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-white">{booking.guestName}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(booking.checkIn).toLocaleDateString('ru')} - {new Date(booking.checkOut).toLocaleDateString('ru')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gold-500">{(booking.ownerFunds || 0).toLocaleString('ru')} ₽</p>
                    {booking.paymentStatus === 'paid' && (
                      <span className="text-xs text-green-500">Оплачено</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}