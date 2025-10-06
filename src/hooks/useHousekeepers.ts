import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/components/housekeeping/types';

export const useHousekeepers = (rooms: Room[], setRooms: (rooms: Room[]) => void) => {
  const [housekeepers, setHousekeepers] = useState<string[]>(() => {
    const savedHousekeepers = localStorage.getItem('housekeepers_list');
    if (savedHousekeepers) {
      try {
        return JSON.parse(savedHousekeepers);
      } catch (e) {
        console.error('Error loading housekeepers:', e);
        return ['Мария', 'Елена', 'Ольга', 'Анна'];
      }
    }
    return ['Мария', 'Елена', 'Ольга', 'Анна'];
  });
  
  const [newHousekeeperName, setNewHousekeeperName] = useState('');

  useEffect(() => {
    console.log('💾 Сохранение горничных в localStorage:', housekeepers);
    localStorage.setItem('housekeepers_list', JSON.stringify(housekeepers));
  }, [housekeepers]);

  const addHousekeeper = useCallback(() => {
    if (!newHousekeeperName.trim()) {
      alert('Введите имя клинера');
      return;
    }
    if (housekeepers.includes(newHousekeeperName.trim())) {
      alert('Этот клинер уже в списке');
      return;
    }
    setHousekeepers(prev => [...prev, newHousekeeperName.trim()]);
    setNewHousekeeperName('');
  }, [newHousekeeperName, housekeepers]);

  const deleteHousekeeper = useCallback((name: string) => {
    if (confirm(`Удалить клинера "${name}" из списка?`)) {
      setHousekeepers(prev => prev.filter(h => h !== name));
      setRooms(rooms.map(room => 
        room.assignedTo === name ? { ...room, assignedTo: '' } : room
      ));
    }
  }, [rooms, setRooms]);

  return {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
  };
};