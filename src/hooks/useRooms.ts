import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/components/housekeeping/types';

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
  const [rooms, setRooms] = useState<Room[]>(() => {
    const savedRooms = localStorage.getItem('housekeeping_current');
    if (savedRooms) {
      try {
        return JSON.parse(savedRooms);
      } catch (e) {
        console.error('Error loading rooms:', e);
        return INITIAL_ROOMS;
      }
    }
    return INITIAL_ROOMS;
  });
  
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

  useEffect(() => {
    localStorage.setItem('housekeeping_current', JSON.stringify(rooms));
  }, [rooms]);

  const updateRoomStatus = useCallback((roomId: string, newStatus: Room['status']) => {
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === roomId 
        ? { ...room, status: newStatus, lastCleaned: newStatus === 'clean' ? new Date().toLocaleString('ru-RU') : room.lastCleaned }
        : room
    ));
  }, []);

  const assignHousekeeper = useCallback((roomId: string, housekeeper: string) => {
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === roomId ? { ...room, assignedTo: housekeeper } : room
    ));
  }, []);

  const addRoom = useCallback(() => {
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
    
    setRooms(prevRooms => [...prevRooms, room]);
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
  }, [newRoom]);

  const deleteRoom = useCallback((roomId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот апартамент?')) {
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    }
  }, []);

  const startEditRoom = useCallback((roomId: string) => {
    setEditingRoomId(roomId);
  }, []);

  const saveEditRoom = useCallback(() => {
    setEditingRoomId(null);
  }, []);

  const updateRoomField = useCallback((roomId: string, field: keyof Room, value: any) => {
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === roomId ? { ...room, [field]: value } : room
    ));
  }, []);

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
  };
};