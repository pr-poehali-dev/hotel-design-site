import { useState, useEffect } from 'react';
import { Guest } from './GuestsList';

const API_URL = 'https://functions.poehali.dev/a0648fb1-e2c4-4c52-86e7-e96230f139d2';

export const useGuestsData = (toast: any) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

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

  return { guests, loading, loadGuests };
};
