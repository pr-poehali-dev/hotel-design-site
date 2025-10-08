import { useState } from 'react';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

export const useGuestActions = (toast: any, loadGuests: () => void) => {
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
        
        setNewGuest({ email: '', password: '', name: '', phone: '', apartment_id: '', check_in: '', check_out: '', price_per_night: '', total_amount: '' });
        loadGuests();
        return true;
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать гостя',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать гостя. Попробуйте позже.',
        variant: 'destructive',
      });
      return false;
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

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewGuest({ ...newGuest, password });
  };

  return {
    newGuest,
    setNewGuest,
    handleAddGuest,
    handleDeleteGuest,
    generatePassword
  };
};
