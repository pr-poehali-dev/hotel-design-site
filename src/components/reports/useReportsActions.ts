import { BookingRecord } from '@/types/booking';
import { bookingsAPI } from '@/api/bookings';

interface UseReportsActionsProps {
  selectedApartment: string;
  bookings: BookingRecord[];
  setLoading: (loading: boolean) => void;
  loadBookings: () => Promise<void>;
  loadMonthlyReports: () => Promise<void>;
}

export const useReportsActions = ({
  selectedApartment,
  bookings,
  setLoading,
  loadBookings,
  loadMonthlyReports
}: UseReportsActionsProps) => {
  
  const handleSaveBooking = async (booking: BookingRecord, editingBooking?: BookingRecord) => {
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

  const handleMarkAsPaid = async (booking: BookingRecord) => {
    if (!confirm(`Отметить выплату ${booking.ownerFunds.toLocaleString('ru')} ₽ как оплаченную?`)) {
      return;
    }
    
    setLoading(true);
    try {
      await bookingsAPI.updateBooking({
        ...booking,
        paymentStatus: 'paid',
        paymentCompletedAt: new Date().toISOString(),
        apartmentId: selectedApartment
      });
      await loadBookings();
      alert('✅ Выплата отмечена как оплаченная');
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      alert('Ошибка при обновлении статуса выплаты');
    } finally {
      setLoading(false);
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
    console.log('🚀 handleShowAllToOwner вызвана');
    console.log('Всего бронирований:', bookings.length);
    console.log('Бронирования:', bookings);
    
    const hiddenCount = bookings.filter(b => !b.showToGuest).length;
    console.log('Скрытых бронирований:', hiddenCount);
    
    if (hiddenCount === 0) {
      alert('Все бронирования уже видны собственнику');
      return;
    }
    
    if (!confirm(`Показать собственнику ${hiddenCount} скрытых бронирований?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const hiddenBookings = bookings.filter(b => !b.showToGuest);
      console.log('Обновляю бронирования:', hiddenBookings.length);
      console.log('Скрытые бронирования:', hiddenBookings);
      
      if (hiddenBookings.length === 0) {
        alert('⚠️ Нет скрытых бронирований для обновления');
        setLoading(false);
        return;
      }
      
      let successCount = 0;
      let failedCount = 0;
      
      for (const booking of hiddenBookings) {
        try {
          console.log('Обновляю бронирование:', booking.id);
          await bookingsAPI.updateBooking({ 
            ...booking, 
            showToGuest: true, 
            apartmentId: selectedApartment 
          });
          successCount++;
          console.log('✅ Обновлено:', booking.id);
        } catch (err) {
          failedCount++;
          console.error('❌ Ошибка обновления бронирования:', booking.id, err);
        }
      }
      
      await loadBookings();
      
      if (failedCount > 0) {
        alert(`⚠️ Обновлено: ${successCount}, Ошибок: ${failedCount}`);
      } else {
        alert(`✅ ${successCount} бронирований теперь видны собственнику`);
      }
    } catch (error: any) {
      console.error('Критическая ошибка:', error);
      alert(`❌ Ошибка: ${error.message || 'Не удалось обновить бронирования'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncBnovo = async () => {
    if (!confirm('Синхронизировать данные из Bnovo?\n\nЭто обновит бронирования и создаст учетные записи для гостей.')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2faa4887-dddc-4f5a-8a48-3073dd398dbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(`✅ Синхронизация завершена!\n\nБронирований: ${data.synced_bookings}\nГостей создано: ${data.created_guests}\nКалендарь обновлён: ${data.updated_calendar} записей`);
        await loadBookings();
      } else {
        alert(`❌ Ошибка синхронизации: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Failed to sync with Bnovo:', error);
      alert('❌ Ошибка при синхронизации с Bnovo');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSaveBooking,
    handleDeleteBooking,
    handleMarkAsPaid,
    handleArchiveMonth,
    handleSendReport,
    handleShowAllToOwner,
    handleSyncBnovo
  };
};