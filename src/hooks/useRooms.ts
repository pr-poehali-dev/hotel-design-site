import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/components/housekeeping/types';

const API_URL = 'https://functions.poehali.dev/2bfc831a-ddc0-4387-9025-124ea0b2b58f';

const INITIAL_ROOMS: Room[] = [
  {
    id: '1',
    number: '501',
    floor: 5,
    status: 'dirty',
    assignedTo: '',
    lastCleaned: '2025-10-04 14:30',
    checkOut: '12:00',
    checkIn: '15:00',
    priority: 'high',
    notes: '',
    payment: 0,
    paymentStatus: 'unpaid'
  },
  {
    id: '2',
    number: '502',
    floor: 5,
    status: 'clean',
    assignedTo: 'Мария',
    lastCleaned: '2025-10-05 10:15',
    checkOut: '',
    checkIn: '16:00',
    priority: 'normal',
    notes: '',
    payment: 500,
    paymentStatus: 'unpaid'
  },
  {
    id: '3',
    number: '601',
    floor: 6,
    status: 'in-progress',
    assignedTo: 'Елена',
    lastCleaned: '2025-10-04 16:00',
    checkOut: '11:00',
    checkIn: '14:00',
    priority: 'high',
    notes: 'Требуется дополнительное белье',
    payment: 700,
    paymentStatus: 'paid'
  },
  {
    id: '4',
    number: '602',
    floor: 6,
    status: 'inspection',
    assignedTo: 'Ольга',
    lastCleaned: '2025-10-05 09:30',
    checkOut: '',
    checkIn: '',
    priority: 'normal',
    notes: '',
    payment: 500,
    paymentStatus: 'unpaid'
  }
];

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: '',
    floor: 1,
    status: 'dirty',
    assignedTo: '',
    checkOut: '',
    checkIn: '',
    priority: 'normal',
    notes: '',
    payment: 0,
    paymentStatus: 'unpaid'
  });

  // Миграция данных из localStorage в БД
  const migrateFromLocalStorage = useCallback(async () => {
    const savedRooms = localStorage.getItem('housekeeping_current');
    if (!savedRooms) return false;
    
    try {
      const rooms = JSON.parse(savedRooms);
      console.log('🔄 Миграция данных из localStorage в БД...');
      
      for (const room of rooms) {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'add_room', room })
        });
      }
      
      console.log('✅ Миграция завершена');
      localStorage.removeItem('housekeeping_current');
      return true;
    } catch (error) {
      console.error('Ошибка миграции:', error);
      return false;
    }
  }, []);

  // Загрузка комнат с сервера
  const loadRooms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?action=rooms`);
      if (!response.ok) throw new Error('Failed to load rooms');
      const data = await response.json();
      
      if (data.rooms && data.rooms.length > 0) {
        setRooms(data.rooms);
      } else {
        // Проверяем localStorage и мигрируем данные
        const migrated = await migrateFromLocalStorage();
        
        if (migrated) {
          // Загружаем мигрированные данные
          const retryResponse = await fetch(`${API_URL}?action=rooms`);
          const retryData = await retryResponse.json();
          setRooms(retryData.rooms || []);
        } else {
          // Если БД пустая и нет localStorage, инициализируем начальными данными
          console.log('🔄 Инициализация БД начальными данными');
          for (const room of INITIAL_ROOMS) {
            await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'add_room', room })
            });
          }
          const retryResponse = await fetch(`${API_URL}?action=rooms`);
          const retryData = await retryResponse.json();
          setRooms(retryData.rooms || []);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки комнат:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [migrateFromLocalStorage]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const updateRoomStatus = useCallback(async (roomId: string, newStatus: Room['status']) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const updatedRoom = {
      ...room,
      status: newStatus,
      lastCleaned: newStatus === 'clean' ? new Date().toLocaleString('ru-RU') : room.lastCleaned
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_room', room: updatedRoom })
      });
      setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  }, [rooms]);

  const assignHousekeeper = useCallback(async (roomId: string, housekeeper: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const updatedRoom = { ...room, assignedTo: housekeeper };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_room', room: updatedRoom })
      });
      setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
    } catch (error) {
      console.error('Ошибка назначения горничной:', error);
    }
  }, [rooms]);

  const addRoom = useCallback(async () => {
    if (!newRoom.number) {
      alert('Введите номер апартамента');
      return;
    }
    
    const room: Room = {
      id: Date.now().toString(),
      number: newRoom.number || '',
      floor: newRoom.floor || 1,
      status: newRoom.status || 'dirty',
      assignedTo: newRoom.assignedTo || '',
      lastCleaned: new Date().toLocaleString('ru-RU'),
      checkOut: newRoom.checkOut || '',
      checkIn: newRoom.checkIn || '',
      priority: newRoom.priority || 'normal',
      notes: newRoom.notes || '',
      payment: newRoom.payment || 0,
      paymentStatus: newRoom.paymentStatus || 'unpaid'
    };
    
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_room', room })
      });
      setRooms(prev => [...prev, room]);
      setNewRoom({
        number: '',
        floor: 1,
        status: 'dirty',
        assignedTo: '',
        checkOut: '',
        checkIn: '',
        priority: 'normal',
        notes: '',
        payment: 0,
        paymentStatus: 'unpaid'
      });
    } catch (error) {
      console.error('Ошибка добавления комнаты:', error);
    }
  }, [newRoom]);

  const deleteRoom = useCallback(async (roomId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот апартамент?')) return;

    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_room', id: roomId })
      });
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Ошибка удаления комнаты:', error);
    }
  }, []);

  const startEditRoom = useCallback((roomId: string) => {
    setEditingRoomId(roomId);
  }, []);

  const saveEditRoom = useCallback(() => {
    setEditingRoomId(null);
  }, []);

  const updateRoomField = useCallback(async (roomId: string, field: keyof Room, value: any) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const updatedRoom = { ...room, [field]: value };
    
    // Оптимистичное обновление UI
    setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));

    // Синхронизация с сервером
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_room', room: updatedRoom })
      });
    } catch (error) {
      console.error('Ошибка обновления поля:', error);
      // Откатываем изменения при ошибке
      setRooms(prev => prev.map(r => r.id === roomId ? room : r));
    }
  }, [rooms]);

  return {
    rooms,
    setRooms,
    editingRoomId,
    newRoom,
    setNewRoom,
    updateRoomStatus,
    assignHousekeeper,
    addRoom,
    deleteRoom,
    startEditRoom,
    saveEditRoom,
    updateRoomField,
    loading,
    reload: loadRooms
  };
};