import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import ReportsTable from '@/components/ReportsTable';
import BookingDialog from '@/components/BookingDialog';
import AdminLogin from '@/components/AdminLogin';
import { BookingRecord } from '@/types/booking';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';
import { bookingsAPI } from '@/api/bookings';

const AUTH_KEY = 'premium_admin_auth';

interface Owner {
  apartmentId: string;
  ownerEmail: string;
  ownerName: string;
  commissionRate: number;
}

const ReportsPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedApartment, setSelectedApartment] = useState('');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [monthlyReports, setMonthlyReports] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | undefined>();
  const [loading, setLoading] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(20);

  const loadBookings = async () => {
    if (!selectedApartment) {
      console.log('loadBookings: no apartment selected');
      return;
    }
    
    setLoading(true);
    try {
      const data = await bookingsAPI.getBookings(selectedApartment);
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyReports = async () => {
    try {
      const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${selectedApartment}`);
      if (response.ok) {
        const data = await response.json();
        setMonthlyReports(data);
      }
    } catch (error) {
      console.error('Failed to load monthly reports:', error);
    }
  };

  const loadOwners = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/03cef8fb-0be9-49db-bf4a-2867e6e483e5');
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
        if (data.length > 0 && !selectedApartment) {
          setSelectedApartment(data[0].apartmentId);
        }
      }
    } catch (error) {
      console.error('Failed to load owners:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOwners();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedApartment) {
      loadBookings();
      loadMonthlyReports();
    }
  }, [selectedApartment]);

  useEffect(() => {
    if (selectedApartment && owners.length > 0) {
      const currentOwner = owners.find(o => o.apartmentId === selectedApartment);
      if (currentOwner) {
        setCommissionRate(currentOwner.commissionRate || 20);
      }
    }
  }, [selectedApartment, owners]);

  useEffect(() => {
    const loadSelectedMonth = async () => {
      if (!selectedApartment) return;
      
      if (selectedMonth === 'current') {
        loadBookings();
      } else {
        setLoading(true);
        try {
          const response = await fetch(`https://functions.poehali.dev/26b287d9-32f7-4801-bf83-fe0cba67b26e?apartment_id=${selectedApartment}&month=${selectedMonth}`);
          if (response.ok) {
            const data = await response.json();
            setBookings(data.reportData || []);
          }
        } catch (error) {
          console.error('Failed to load archived report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadSelectedMonth();
  }, [selectedMonth, selectedApartment]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const handleAddBooking = () => {
    setEditingBooking(undefined);
    setDialogOpen(true);
  };

  const handleEditBooking = (booking: BookingRecord) => {
    setEditingBooking(booking);
    setDialogOpen(true);
  };

  const handleSaveBooking = async (booking: BookingRecord) => {
    setLoading(true);
    try {
      const bookingWithApartment = { ...booking, apartmentId: selectedApartment };
      if (editingBooking) {
        await bookingsAPI.updateBooking(bookingWithApartment);
      } else {
        await bookingsAPI.createBooking(bookingWithApartment);
      }
      await loadBookings();
    } catch (error) {
      console.error('Failed to save booking:', error);
      alert('Ошибка при сохранении бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Удалить это бронирование?')) {
      setLoading(true);
      try {
        await bookingsAPI.deleteBooking(id, selectedApartment);
        await loadBookings();
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert('Ошибка при удалении бронирования');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleArchiveMonth = async () => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const reportMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const monthName = lastMonth.toLocaleDateString('ru', { year: 'numeric', month: 'long' });
    
    if (!confirm(`Архивировать отчёты всех апартаментов за ${monthName}?\n\nЭто создаст архив прошлого месяца для всех собственников.`)) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/463e593e-5863-4107-a36c-c825da3844fd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ Архивация завершена!\n\nАрхивировано отчётов: ${data.archivedCount}\nПериод: ${monthName}`);
        await loadMonthlyReports();
      } else {
        alert(`❌ Ошибка при архивировании: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Failed to archive month:', error);
      alert('❌ Ошибка при архивировании отчета');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReport = (booking: BookingRecord) => {
    if (!booking.guestEmail) {
      alert('Не указан email гостя');
      return;
    }
    
    const subject = `Отчет по бронированию ${booking.checkIn} - ${booking.checkOut}`;
    const body = `Здравствуйте, ${booking.guestName || 'Уважаемый гость'}!

Направляем вам отчет по бронированию:

Период: ${booking.checkIn} - ${booking.checkOut}
Сумма проживания: ${booking.accommodationAmount.toLocaleString('ru')} ₽
Итоговая сумма: ${booking.totalAmount.toLocaleString('ru')} ₽
${booking.earlyCheckIn > 0 ? `Ранний заезд: ${booking.earlyCheckIn.toLocaleString('ru')} ₽\n` : ''}${booking.lateCheckOut > 0 ? `Поздний выезд: ${booking.lateCheckOut.toLocaleString('ru')} ₽\n` : ''}${booking.parking > 0 ? `Паркинг: ${booking.parking.toLocaleString('ru')} ₽\n` : ''}
С уважением,
Premium Apartments`;

    window.location.href = `mailto:${booking.guestEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleShowAllToOwner = async () => {
    const hiddenCount = bookings.filter(b => !b.showToGuest).length;
    
    if (hiddenCount === 0) {
      alert('Все бронирования уже видны собственнику');
      return;
    }
    
    if (!confirm(`Показать собственнику ${hiddenCount} скрытых бронирований?`)) {
      return;
    }
    
    setLoading(true);
    try {
      for (const booking of bookings) {
        if (!booking.showToGuest) {
          await bookingsAPI.updateBooking({ ...booking, showToGuest: true, apartmentId: selectedApartment });
        }
      }
      await loadBookings();
      alert(`✅ ${hiddenCount} бронирований теперь видны собственнику`);
    } catch (error) {
      console.error('Failed to update bookings:', error);
      alert('❌ Ошибка при обновлении бронирований');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-50 to-white">
      <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div 
                className="relative cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate('/')}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <div>
                <h1 
                  className="font-playfair font-bold text-2xl text-gold-400 cursor-pointer hover:text-gold-300 transition-colors"
                  onClick={() => navigate('/')}
                >
                  Premium Apartments
                </h1>
                <p className="text-sm text-gray-400 font-inter">Поклонная 9</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <select
                value={selectedApartment}
                onChange={(e) => setSelectedApartment(e.target.value)}
                className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 font-inter"
              >
                {owners.length === 0 ? (
                  <option value="">Загрузка...</option>
                ) : (
                  owners.map(owner => (
                    <option key={owner.apartmentId} value={owner.apartmentId}>
                      Апартамент {owner.apartmentId}
                    </option>
                  ))
                )}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 font-inter"
              >
                <option value="current">Текущий период</option>
                {monthlyReports.map(report => (
                  <option key={report.reportMonth} value={report.reportMonth}>
                    {new Date(report.reportMonth + '-01').toLocaleDateString('ru', { year: 'numeric', month: 'long' })}
                  </option>
                ))}
              </select>
              {selectedMonth === 'current' && (
                <>
                  <FizzyButton
                    onClick={handleShowAllToOwner}
                    variant="secondary"
                    icon={<Icon name="Eye" size={18} />}
                    disabled={loading}
                  >
                    Показать все собственнику
                  </FizzyButton>
                  <FizzyButton
                    onClick={handleArchiveMonth}
                    variant="secondary"
                    icon={<Icon name="Archive" size={18} />}
                    disabled={loading}
                  >
                    Архивировать прошлый месяц
                  </FizzyButton>
                </>
              )}
              <FizzyButton
                onClick={() => navigate('/owners')}
                variant="secondary"
                icon={<Icon name="Users" size={18} />}
              >
                Собственники
              </FizzyButton>
              <FizzyButton
                onClick={() => navigate('/')}
                variant="secondary"
                icon={<Icon name="Home" size={18} />}
              >
                На главную
              </FizzyButton>
              <FizzyButton
                onClick={handleLogout}
                variant="secondary"
                icon={<Icon name="LogOut" size={18} />}
              >
                Выйти
              </FizzyButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {owners.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Нет собственников</h2>
            <p className="text-gray-600 mb-4">
              Добавьте собственников в разделе управления для просмотра отчетов
            </p>
            <FizzyButton
              onClick={() => navigate('/owners')}
              icon={<Icon name="Plus" size={18} />}
            >
              Добавить собственника
            </FizzyButton>
          </Card>
        ) : selectedApartment ? (
          <ReportsTable
            bookings={bookings}
            onAddBooking={selectedMonth === 'current' ? handleAddBooking : undefined}
            onEditBooking={selectedMonth === 'current' ? handleEditBooking : undefined}
            onDeleteBooking={selectedMonth === 'current' ? handleDeleteBooking : undefined}
            onSendReport={handleSendReport}
            readOnly={selectedMonth !== 'current'}
            managementCommissionRate={commissionRate}
          />
        ) : null}
      </main>

      <BookingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveBooking}
        booking={editingBooking}
        commissionRate={commissionRate}
      />
    </div>
  );
};

export default ReportsPage;