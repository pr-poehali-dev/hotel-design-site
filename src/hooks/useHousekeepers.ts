import { useState, useEffect } from 'react';
import { Room } from '@/components/housekeeping/types';

export const useHousekeepers = (rooms: Room[], setRooms: (rooms: Room[]) => void) => {
  const [housekeepers, setHousekeepers] = useState<string[]>(['Мария', 'Елена', 'Ольга', 'Анна']);
  const [newHousekeeperName, setNewHousekeeperName] = useState('');

  useEffect(() => {
    const savedHousekeepers = localStorage.getItem('housekeepers_list');
    if (savedHousekeepers) {
      try {
        setHousekeepers(JSON.parse(savedHousekeepers));
      } catch (e) {
        console.error('Error loading housekeepers:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('housekeepers_list', JSON.stringify(housekeepers));
  }, [housekeepers]);

  const addHousekeeper = () => {
    if (!newHousekeeperName.trim()) {
      alert('Введите имя горничной');
      return;
    }
    if (housekeepers.includes(newHousekeeperName.trim())) {
      alert('Эта горничная уже в списке');
      return;
    }
    setHousekeepers([...housekeepers, newHousekeeperName.trim()]);
    setNewHousekeeperName('');
  };

  const deleteHousekeeper = (name: string) => {
    if (confirm(`Удалить горничную "${name}" из списка?`)) {
      setHousekeepers(housekeepers.filter(h => h !== name));
      setRooms(rooms.map(room => 
        room.assignedTo === name ? { ...room, assignedTo: '' } : room
      ));
    }
  };

  return {
    housekeepers,
    newHousekeeperName,
    setNewHousekeeperName,
    addHousekeeper,
    deleteHousekeeper,
  };
};
