import { useState, useEffect, useCallback } from 'react';
import { Room, Housekeeper } from '@/components/housekeeping/types';

const API_URL = 'https://functions.poehali.dev/2bfc831a-ddc0-4387-9025-124ea0b2b58f';
const UPDATE_API_URL = 'https://functions.poehali.dev/9778c1df-7db7-4cd4-a0f9-9ea3bf34f2ab';

export const useHousekeepers = (rooms: Room[], setRooms: (rooms: Room[]) => void) => {
  const [housekeepers, setHousekeepers] = useState<Housekeeper[]>([]);
  const [newHousekeeperName, setNewHousekeeperName] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка горничных с сервера
  const loadHousekeepers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?action=housekeepers`);
      if (!response.ok) throw new Error('Failed to load housekeepers');
      const data = await response.json();
      
      // Преобразуем старый формат (массив строк) в новый (массив объектов)
      const housekeepersData = data.housekeepers || [];
      if (housekeepersData.length > 0 && typeof housekeepersData[0] === 'string') {
        // Старый формат - преобразуем в объекты
        const converted: Housekeeper[] = housekeepersData.map((name: string, idx: number) => ({
          id: idx + 1,
          name,
          email: undefined,
          created_at: new Date().toISOString()
        }));
        setHousekeepers(converted);
      } else {
        // Новый формат
        setHousekeepers(housekeepersData);
      }
    } catch (error) {
      console.error('Ошибка загрузки горничных:', error);
      setHousekeepers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHousekeepers();
    
    // Защита от бесконечной загрузки
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Таймаут загрузки горничных - принудительная остановка');
        setLoading(false);
      }
    }, 10000); // 10 секунд
    
    return () => clearTimeout(timeout);
  }, [loadHousekeepers]);

  const addHousekeeper = useCallback(async () => {
    if (!newHousekeeperName.trim()) {
      alert('Введите имя клинера');
      return;
    }
    if (housekeepers.some(h => h.name === newHousekeeperName.trim())) {
      alert('Этот клинер уже в списке');
      return;
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_housekeeper', name: newHousekeeperName.trim() })
      });
      await loadHousekeepers();
      setNewHousekeeperName('');
    } catch (error) {
      console.error('Ошибка добавления горничной:', error);
      alert('Не удалось добавить горничную');
    }
  }, [newHousekeeperName, housekeepers, loadHousekeepers]);

  const deleteHousekeeper = useCallback(async (id: number) => {
    const housekeeper = housekeepers.find(h => h.id === id);
    if (!housekeeper) return;
    
    if (!confirm(`Удалить клинера "${housekeeper.name}" из списка?`)) return;

    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_housekeeper', name: housekeeper.name })
      });
      setHousekeepers(prev => prev.filter(h => h.id !== id));
      
      // Убираем назначение с комнат
      const updatedRooms = rooms.map(room => 
        room.assignedTo === housekeeper.name ? { ...room, assignedTo: '' } : room
      );
      setRooms(updatedRooms);

      // Обновляем на сервере
      for (const room of updatedRooms.filter(r => r.assignedTo === '')) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_room', room })
        });
      }
    } catch (error) {
      console.error('Ошибка удаления горничной:', error);
      alert('Не удалось удалить горничную');
    }
  }, [rooms, setRooms, housekeepers]);

  const updateHousekeeper = useCallback(async (id: number, name: string, email: string, password?: string) => {
    try {
      const body: any = { id, name, email };
      if (password) {
        body.password = password;
      }
      
      const response = await fetch(UPDATE_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) throw new Error('Failed to update housekeeper');
      
      await loadHousekeepers();
    } catch (error) {
      console.error('Ошибка обновления горничной:', error);
      alert('Не удалось обновить данные горничной');
    }
  }, [loadHousekeepers]);

  return {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
    updateHousekeeper,
    loading,
    reload: loadHousekeepers
  };
};