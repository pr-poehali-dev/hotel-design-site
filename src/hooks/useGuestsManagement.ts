import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Guest } from '@/components/guests/GuestsList';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

export const useGuestsManagement = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEditBookingDialog, setShowEditBookingDialog] = useState(false);
  const [showAddBookingDialog, setShowAddBookingDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<number>(0);
  const [selectedGuestName, setSelectedGuestName] = useState<string>('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const { toast } = useToast();

  const [newGuest, setNewGuest] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    apartment_id: '',
    check_in: '',
    check_out: '',
    price_per_night: '',
    total_amount: ''
  });

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGuests(data.guests || []);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить гостей',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить гостей. Попробуйте позже.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleAddGuest = async () => {
    if (!newGuest.email || !newGuest.password) {
      toast({
        title: 'Ошибка',
        description: 'Email и пароль обязательны',
        variant: 'destructive',
      });
      return;
    }

    if (!newGuest.apartment_id || !newGuest.check_in || !newGuest.check_out) {
      toast({
        title: 'Ошибка',
        description: 'Заполните информацию о бронировании',
        variant: 'destructive',
      });
      return;
    }

    if (!newGuest.price_per_night || !newGuest.total_amount) {
      toast({
        title: 'Ошибка',
        description: 'Укажите стоимость проживания',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: newGuest.email,
          password: newGuest.password,
          name: newGuest.name,
          phone: newGuest.phone,
          apartment_id: newGuest.apartment_id,
          check_in: newGuest.check_in,
          check_out: newGuest.check_out,
          price_per_night: parseFloat(newGuest.price_per_night),
          total_amount: parseFloat(newGuest.total_amount)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Гость и бронирование созданы. Отправьте гостю email и пароль для входа.',
        });
        
        setShowAddDialog(false);
        setNewGuest({ email: '', password: '', name: '', phone: '', apartment_id: '', check_in: '', check_out: '', price_per_night: '', total_amount: '' });
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать гостя',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать гостя. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewGuest({ ...newGuest, password });
  };

  const generateResetPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetPassword(password);
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !resetPassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите email и новый пароль',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_password',
          email: resetEmail,
          new_password: resetPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Пароль изменён!',
          description: 'Отправьте новый пароль гостю для входа.',
        });
        
        setShowResetDialog(false);
        setResetEmail('');
        setResetPassword('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сбросить пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сбросить пароль. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const handleEditBooking = (guestId: number, booking: any) => {
    setEditingBooking(booking);
    setShowEditBookingDialog(true);
  };

  const handleAddBooking = (guestId: number, guestName: string) => {
    setSelectedGuestId(guestId);
    setSelectedGuestName(guestName);
    setShowAddBookingDialog(true);
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
        toast({
          title: 'Успешно!',
          description: 'Бронирование создано. Гость увидит его в своём личном кабинете.',
        });
        
        setShowAddBookingDialog(false);
        setSelectedGuestId(0);
        setSelectedGuestName('');
        loadGuests();
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
        description: 'Не удалось создать бронирование. Попробуйте позже.',
        variant: 'destructive',
      });
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
        
        setShowEditBookingDialog(false);
        setEditingBooking(null);
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось обновить бронирование',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить бронирование. Попробуйте позже.',
        variant: 'destructive',
      });
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

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого гостя? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Гость удалён',
        });
        loadGuests();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось удалить гостя',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить гостя. Попробуйте позже.',
        variant: 'destructive',
      });
    }
  };

  const filteredAndSortedGuests = guests
    .filter((guest) => {
      const query = searchQuery.toLowerCase();
      return (
        guest.email.toLowerCase().includes(query) ||
        guest.name?.toLowerCase().includes(query) ||
        guest.phone?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return (a.name || '').localeCompare(b.name || '');
      }
    });

  return {
    guests,
    loading,
    showAddDialog,
    setShowAddDialog,
    showResetDialog,
    setShowResetDialog,
    showEditBookingDialog,
    setShowEditBookingDialog,
    showAddBookingDialog,
    setShowAddBookingDialog,
    editingBooking,
    selectedGuestId,
    selectedGuestName,
    resetEmail,
    setResetEmail,
    resetPassword,
    setResetPassword,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    newGuest,
    setNewGuest,
    filteredAndSortedGuests,
    handleAddGuest,
    generatePassword,
    generateResetPassword,
    handleResetPassword,
    handleEditBooking,
    handleAddBooking,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking,
    handleDeleteGuest,
  };
};
