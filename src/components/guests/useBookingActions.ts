import { useState } from 'react';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';
const EMAIL_API_URL = 'https://functions.poehali.dev/247fe753-02a4-4d5a-b9b2-b2182701293b';

export const useBookingActions = (toast: any, loadGuests: () => void) => {
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<number>(0);
  const [selectedGuestName, setSelectedGuestName] = useState<string>('');
  const [selectedGuestEmail, setSelectedGuestEmail] = useState<string>('');

  const handleEditBooking = (guestId: number, booking: any) => {
    setEditingBooking(booking);
  };

  const handleAddBooking = (guestId: number, guestName: string, guestEmail: string = '') => {
    setSelectedGuestId(guestId);
    setSelectedGuestName(guestName);
    setSelectedGuestEmail(guestEmail);
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      const response = await fetch(`${API_URL}?action=create_booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        fetch(EMAIL_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guest_email: bookingData.guest_email,
            guest_name: bookingData.guest_name,
            apartment_id: bookingData.apartment_id,
            check_in: bookingData.check_in,
            check_out: bookingData.check_out,
            total_amount: bookingData.total_amount,
            guests_count: bookingData.guests_count,
            guest_comment: bookingData.guest_comment
          })
        }).catch(() => {});

        toast({
          title: 'Успешно!',
          description: 'Бронирование создано. Гость получит письмо с подтверждением.',
        });
        
        setSelectedGuestId(0);
        setSelectedGuestName('');
        loadGuests();
        return true;
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать бронирование',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать бронирование. Попробуйте позже.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleUpdateBooking = async (bookingData: any) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Бронирование обновлено. Изменения сразу отобразятся у гостя.',
        });
        
        setEditingBooking(null);
        loadGuests();
        return true;
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось обновить бронирование',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить бронирование. Попробуйте позже.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это бронирование?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?action=delete_booking&booking_id=${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Удалено!',
          description: 'Бронирование удалено. Гость больше не увидит его в личном кабинете.',
        });
        
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось удалить бронирование',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить бронирование. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  return {
    editingBooking,
    setEditingBooking,
    selectedGuestId,
    selectedGuestName,
    selectedGuestEmail,
    handleEditBooking,
    handleAddBooking,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking
  };
};