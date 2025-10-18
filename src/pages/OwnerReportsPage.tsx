import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import { BookingRecord } from '@/types/booking';
import { bookingsAPI } from '@/api/bookings';
import Icon from '@/components/ui/icon';

export default function OwnerReportsPage() {
  const { apartmentId } = useParams<{ apartmentId: string }>();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState<{ ownerName: string; ownerEmail: string } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getCurrentMonthName = () => {
    if (selectedMonth === 'current') {
      return new Date().toLocaleDateString('ru', { year: 'numeric', month: 'long' });
    }
    return new Date(selectedMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' });
  };

  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerId = localStorage.getItem('ownerId');
    
    if (!token || !ownerId) {
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

        const reportsResponse = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${apartmentId}`);
        if (reportsResponse.ok) {
          const reports = await reportsResponse.json();
          setMonthlyReports(reports);
        }

        const bookingsData = await bookingsAPI.getBookings(apartmentId);
        const filteredBookings = bookingsData.filter((b: BookingRecord) => b.showToGuest);
        setBookings(filteredBookings);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apartmentId]);

  useEffect(() => {
    const loadSelectedMonth = async () => {
      if (!apartmentId) return;
      
      if (selectedMonth === 'current') {
        setLoading(true);
        try {
          const bookingsData = await bookingsAPI.getBookings(apartmentId);
          const filteredBookings = bookingsData.filter((b: BookingRecord) => b.showToGuest);
          setBookings(filteredBookings);
        } catch (error) {
          console.error('Failed to load bookings:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${apartmentId}&month=${selectedMonth}`);
          if (response.ok) {
            const data = await response.json();
            let reportData = data.reportData || [];
            
            if (typeof reportData === 'string') {
              reportData = JSON.parse(reportData);
            }
            
            const filteredBookings = reportData.filter((b: any) => b.showToGuest);
            setBookings(filteredBookings);
          }
        } catch (error) {
          console.error('Failed to load archived report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedMonth();
  }, [selectedMonth, apartmentId]);

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

  const totalAmount = bookings.reduce((sum, b) => sum + b.ownerFunds, 0);
  const pendingBookings = bookings.filter(b => b.paymentStatus !== 'paid');
  const paidBookings = bookings.filter(b => b.paymentStatus === 'paid');
  const pendingAmount = pendingBookings.reduce((sum, b) => sum + b.ownerFunds, 0);
  const paidAmount = paidBookings.reduce((sum, b) => sum + b.ownerFunds, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      {/* Header */}
      <div className="bg-charcoal-900 border-b border-gold-500/20 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  Апартамент {apartmentId}
                </h1>
                {ownerInfo && (
                  <p className="text-xs text-gray-400">
                    {ownerInfo.ownerName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-charcoal-800 rounded-lg transition-colors"
            >
              <Icon name="LogOut" size={20} className="text-gray-400" />
            </button>
          </div>
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-4 py-3 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none"
          >
            <option value="current">Текущий период</option>
            {monthlyReports.map(report => (
              <option key={report.reportMonth} value={report.reportMonth}>
                {new Date(report.reportMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Card */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gold-500 to-gold-600 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal-900/70 font-medium mb-1">
                    К получению
                  </p>
                  <p className="text-xs text-charcoal-900/60">
                    {getCurrentMonthName()}
                  </p>
                </div>
                <Icon name="Clock" size={32} className="text-charcoal-900/30" />
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-charcoal-900">
                  {pendingAmount.toLocaleString('ru')} ₽
                </p>
                <p className="text-sm text-charcoal-900/60 mt-1">
                  {pendingBookings.length} {pendingBookings.length === 1 ? 'бронирование' : pendingBookings.length < 5 ? 'бронирования' : 'бронирований'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/90 font-medium mb-1">
                    Получено
                  </p>
                  <p className="text-xs text-white/70">
                    {getCurrentMonthName()}
                  </p>
                </div>
                <Icon name="CheckCircle2" size={32} className="text-white/30" />
              </div>
              <div className="mt-4">
                <p className="text-4xl font-bold text-white">
                  {paidAmount.toLocaleString('ru')} ₽
                </p>
                <p className="text-sm text-white/80 mt-1">
                  {paidBookings.length} {paidBookings.length === 1 ? 'выплата' : paidBookings.length < 5 ? 'выплаты' : 'выплат'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Content */}
        {bookings.length === 0 ? (
          <Card className="bg-charcoal-800 border-charcoal-700">
            <div className="text-center py-12">
              <Icon name="FileX" size={48} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Нет бронирований для отображения</p>
            </div>
          </Card>
        ) : (
          <>
            {/* Pending Payments Section */}
            {pendingBookings.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Clock" size={24} className="text-gold-500" />
                  <h2 className="text-xl font-bold text-white">К оплате</h2>
                  <span className="text-sm text-gray-400">({pendingAmount.toLocaleString('ru')} ₽)</span>
                </div>
                {isMobile ? (
                  <div className="space-y-4 mb-8">
                    {pendingBookings.map((booking) => (
                  <Card key={booking.id} className="bg-charcoal-800 border-charcoal-700 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon name="Calendar" size={16} className="text-gold-500" />
                            <span className="text-white font-medium">
                              {new Date(booking.checkIn).toLocaleDateString('ru', { day: 'numeric', month: 'short' })} - {new Date(booking.checkOut).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          {booking.guestName && (
                            <p className="text-sm text-gray-400 flex items-center gap-2">
                              <Icon name="User" size={14} />
                              {booking.guestName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gold-500">
                            {booking.ownerFunds.toLocaleString('ru')} ₽
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-charcoal-700 pt-3 mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Проживание</p>
                          <p className="text-white font-medium">{booking.accommodationAmount.toLocaleString('ru')} ₽</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Итого</p>
                          <p className="text-white font-medium">{booking.totalAmount.toLocaleString('ru')} ₽</p>
                        </div>
                        {booking.earlyCheckIn > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Ранний заезд</p>
                            <p className="text-white font-medium">{booking.earlyCheckIn.toLocaleString('ru')} ₽</p>
                          </div>
                        )}
                        {booking.lateCheckOut > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Поздний выезд</p>
                            <p className="text-white font-medium">{booking.lateCheckOut.toLocaleString('ru')} ₽</p>
                          </div>
                        )}
                        {booking.parking > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Паркинг</p>
                            <p className="text-white font-medium">{booking.parking.toLocaleString('ru')} ₽</p>
                          </div>
                        )}
                      </div>
                      
                      {booking.operatingExpenses > 0 && (
                        <div className="border-t border-charcoal-700 pt-3 mt-3">
                          <p className="text-gray-500 text-xs mb-2">Расходы</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {booking.maid > 0 && <div className="text-gray-400">Горничная: {booking.maid.toLocaleString('ru')} ₽</div>}
                            {booking.laundry > 0 && <div className="text-gray-400">Прачечная: {booking.laundry.toLocaleString('ru')} ₽</div>}
                            {booking.hygiene > 0 && <div className="text-gray-400">Гигиена: {booking.hygiene.toLocaleString('ru')} ₽</div>}
                            {booking.transport > 0 && <div className="text-gray-400">Транспорт: {booking.transport.toLocaleString('ru')} ₽</div>}
                            {booking.compliment > 0 && <div className="text-gray-400">Комплимент: {booking.compliment.toLocaleString('ru')} ₽</div>}
                            {booking.other > 0 && <div className="text-gray-400">Прочее: {booking.other.toLocaleString('ru')} ₽</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white mb-8">
                <div className="p-6">
                  <ReportsTable
                    bookings={pendingBookings}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    readOnly={true}
                  />
                </div>
              </Card>
            )}
              </>
            )}

            {/* Payment History Section */}
            {paidBookings.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-4 mt-8">
                  <Icon name="CheckCircle2" size={24} className="text-green-500" />
                  <h2 className="text-xl font-bold text-white">История выплат</h2>
                  <span className="text-sm text-gray-400">({paidAmount.toLocaleString('ru')} ₽)</span>
                </div>
                {isMobile ? (
                  <div className="space-y-4">
                    {paidBookings.map((booking) => (
                      <Card key={booking.id} className="bg-charcoal-800/50 border-green-500/30 overflow-hidden">
                        <div className="p-4 opacity-75">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon name="CheckCircle" size={14} className="text-green-500" />
                                <span className="text-white font-medium text-sm">
                                  {new Date(booking.checkIn).toLocaleDateString('ru', { day: 'numeric', month: 'short' })} - {new Date(booking.checkOut).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                                </span>
                              </div>
                              {booking.paymentCompletedAt && (
                                <p className="text-xs text-green-400">
                                  Оплачено: {new Date(booking.paymentCompletedAt).toLocaleDateString('ru')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-500">
                                {booking.ownerFunds.toLocaleString('ru')} ₽
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white/95">
                    <div className="p-6">
                      <ReportsTable
                        bookings={paidBookings}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        readOnly={true}
                      />
                    </div>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}