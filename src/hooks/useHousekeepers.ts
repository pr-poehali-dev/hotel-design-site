import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/components/housekeeping/types';

const API_URL = 'https://functions.poehali.dev/2bfc831a-ddc0-4387-9025-124ea0b2b58f';

export const useHousekeepers = (rooms: Room[], setRooms: (rooms: Room[]) => void) => {
  const [housekeepers, setHousekeepers] = useState<string[]>([]);
  const [newHousekeeperName, setNewHousekeeperName] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка горничных с сервера
  const loadHousekeepers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?action=housekeepers`);
      if (!response.ok) throw new Error('Failed to load housekeepers');
      const data = await response.json();
      setHousekeepers(data.housekeepers || []);
    } catch (error) {
      console.error('Ошибка загрузки горничных:', error);
      // Fallback на localStorage
      const savedHousekeepers = localStorage.getItem('housekeepers_list');
      if (savedHousekeepers) {
        setHousekeepers(JSON.parse(savedHousekeepers));
      } else {
        setHousekeepers(['Мария', 'Елена', 'Ольга', 'Анна']);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHousekeepers();
  }, [loadHousekeepers]);

  const addHousekeeper = useCallback(async () => {
    if (!newHousekeeperName.trim()) {
      alert('Введите имя клинера');
      return;
    }
    if (housekeepers.includes(newHousekeeperName.trim())) {
      alert('Этот клинер уже в списке');
      return;
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_housekeeper', name: newHousekeeperName.trim() })
      });
      setHousekeepers(prev => [...prev, newHousekeeperName.trim()].sort());
      setNewHousekeeperName('');
    } catch (error) {
      console.error('Ошибка добавления горничной:', error);
      alert('Не удалось добавить горничную');
    }
  }, [newHousekeeperName, housekeepers]);

  const deleteHousekeeper = useCallback(async (name: string) => {
    if (!confirm(`Удалить клинера "${name}" из списка?`)) return;

    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_housekeeper', name })
      });
      setHousekeepers(prev => prev.filter(h => h !== name));
      
      // Убираем назначение с комнат
      const updatedRooms = rooms.map(room => 
        room.assignedTo === name ? { ...room, assignedTo: '' } : room
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
  }, [rooms, setRooms]);

  return {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
    loading,
    reload: loadHousekeepers
  };
};
