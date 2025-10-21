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
  const [showHistory, setShowHistory] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  
  useEffect(() => {
    console.log('Selected booking changed:', selectedBooking);
  }, [selectedBooking]);
  
  useEffect(() => {
    console.log('Bookings loaded:', bookings.length);
    if (bookings.length > 0) {
      console.log('First booking sample:', bookings[0]);
    }
  }, [bookings]);
  
  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(date);
    }
    return months;
  };
  
  const monthOptions = generateMonthOptions();
  const currentMonth = selectedMonth.toLocaleDateString('ru', { month: 'long', year: 'numeric' });
  const isCurrentMonth = selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear();
  
  const filteredBookings = bookings.filter(b => {
    const checkIn = new Date(b.checkIn);
    return checkIn.getMonth() === selectedMonth.getMonth() && checkIn.getFullYear() === selectedMonth.getFullYear();
  });

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
          console.log('Raw bookings data:', data);
          const filteredBookings = (data || []).filter((b: any) => b.showToGuest);
          console.log('Filtered bookings:', filteredBookings);
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

  const totalAmount = filteredBookings.reduce((sum, b) => sum + (b.ownerFunds || 0), 0);
  const paidAmount = filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.ownerFunds || 0), 0);

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
        {/* Период */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Calendar" size={20} className="text-gold-500" />
            <span className="text-white font-semibold">Выбор периода</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {monthOptions.map((month, index) => {
              const isSelected = month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear();
              const isCurrent = month.getMonth() === new Date().getMonth() && month.getFullYear() === new Date().getFullYear();
              const label = month.toLocaleDateString('ru', { month: 'short', year: 'numeric' });
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-gold-500 text-charcoal-900 font-semibold'
                      : 'bg-charcoal-800 text-gray-400 hover:bg-charcoal-700'
                  }`}
                >
                  {label}
                  {isCurrent && isSelected && (
                    <span className="ml-1 text-xs">●</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* История */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="History" size={18} />
            История оплат
          </button>
        </div>

        {/* Карточки сумм */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gold-500 to-gold-600 border-0 p-6">
            <div className="text-center">
              <p className="text-sm text-charcoal-900/80 mb-2">Итого к получению</p>
              <p className="text-3xl font-bold text-charcoal-900">{totalAmount.toLocaleString('ru')} ₽</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 p-6">
            <div className="text-center">
              <p className="text-sm text-white/80 mb-2">Уже оплачено</p>
              <p className="text-3xl font-bold text-white">{paidAmount.toLocaleString('ru')} ₽</p>
            </div>
          </Card>
        </div>

        {/* Бронирования выбранного периода */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-semibold text-white">Бронирования</h2>
            {isCurrentMonth && (
              <span className="text-xs bg-gold-500/20 text-gold-500 px-2 py-1 rounded-full">Текущий период</span>
            )}
          </div>
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Нет бронирований за выбранный период</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="p-4 cursor-pointer hover:bg-charcoal-700/50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Clicked booking:', booking.id, booking);
                    setSelectedBooking(booking);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white">{booking.guestName}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(booking.checkIn).toLocaleDateString('ru')} - {new Date(booking.checkOut).toLocaleDateString('ru')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Icon name="Eye" size={14} />
                        Нажмите для детализации
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gold-500">{(booking.ownerFunds || 0).toLocaleString('ru')} ₽</p>
                      {booking.paymentStatus === 'paid' && (
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Оплачено</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* История оплат */}
        {showHistory && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-white mb-3">История оплат за {currentMonth}</h2>
            <div className="space-y-3">
              {filteredBookings.filter(b => b.paymentStatus === 'paid').length === 0 ? (
                <Card className="p-6 text-center">
                  <Icon name="Clock" size={40} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Нет оплаченных бронирований за этот период</p>
                </Card>
              ) : (
                filteredBookings.filter(b => b.paymentStatus === 'paid').map((booking) => (
                  <Card key={booking.id} className="p-4 bg-charcoal-800/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-white">{booking.guestName}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(booking.checkIn).toLocaleDateString('ru')} - {new Date(booking.checkOut).toLocaleDateString('ru')}
                        </p>
                        {booking.prepaymentDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Оплачено: {new Date(booking.prepaymentDate).toLocaleDateString('ru')}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">{(booking.ownerFunds || 0).toLocaleString('ru')} ₽</p>
                        <Icon name="CheckCircle" size={16} className="text-green-500 ml-auto mt-1" />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Слайд-панель с расшифровкой */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="fixed bottom-0 left-0 right-0 bg-charcoal-900 rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="sticky top-0 bg-charcoal-900 border-b border-gold-500/20 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon name="Receipt" size={24} className="text-gold-500" />
                <h3 className="text-lg font-bold text-white">Детализация расходов</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-charcoal-800 rounded-lg">
                <Icon name="X" size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Информация о бронировании */}
              <div className="bg-charcoal-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Период</p>
                <p className="text-white font-semibold">
                  {new Date(selectedBooking.checkIn).toLocaleDateString('ru')} — {new Date(selectedBooking.checkOut).toLocaleDateString('ru')}
                </p>
                <p className="text-sm text-gray-400 mt-2">Гость</p>
                <p className="text-white">{selectedBooking.guestName || 'Не указано'}</p>
              </div>

              {/* Расшифровка */}
              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-400">Общая сумма</span>
                  <span className="text-white font-semibold">{selectedBooking.totalAmount?.toLocaleString('ru') || 0} ₽</span>
                </div>
                
                <div className="flex justify-between items-center text-red-400">
                  <span>Комиссия агрегатора</span>
                  <span>- {selectedBooking.aggregatorCommission?.toLocaleString('ru') || 0} ₽</span>
                </div>

                {selectedBooking.expenses && (
                  <>
                    {selectedBooking.expenses.maid > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Горничная</span>
                        <span>- {selectedBooking.expenses.maid.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                    {selectedBooking.expenses.laundry > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Прачка</span>
                        <span>- {selectedBooking.expenses.laundry.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                    {selectedBooking.expenses.hygiene > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Гигиена</span>
                        <span>- {selectedBooking.expenses.hygiene.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                    {selectedBooking.expenses.transport > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Транспорт</span>
                        <span>- {selectedBooking.expenses.transport.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                    {selectedBooking.expenses.compliment > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Комплимент</span>
                        <span>- {selectedBooking.expenses.compliment.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                    {selectedBooking.expenses.other > 0 && (
                      <div className="flex justify-between items-center text-red-400">
                        <span>Прочее {selectedBooking.expenses.otherNote && `(${selectedBooking.expenses.otherNote})`}</span>
                        <span>- {selectedBooking.expenses.other.toLocaleString('ru')} ₽</span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gold-500/30">
                  <span className="text-gold-500 font-bold">К получению</span>
                  <span className="text-gold-500 font-bold text-xl">
                    {(selectedBooking.ownerFunds || 0).toLocaleString('ru')} ₽
                  </span>
                </div>
              </div>
              
              {/* Отступ снизу для комфортного скролла */}
              <div className="h-8"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}