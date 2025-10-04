import { useState, useEffect } from 'react';
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
    notes: ''
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
    notes: ''
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
    notes: 'Требуется дополнительное белье'
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
    notes: ''
  }
];

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: '',
    floor: 1,
    status: 'dirty',
    assignedTo: '',
    checkOut: '',
    checkIn: '',
    priority: 'normal',
    notes: ''
  });

  useEffect(() => {
    const savedRooms = localStorage.getItem('housekeeping_current');
    if (savedRooms) {
      try {
        setRooms(JSON.parse(savedRooms));
      } catch (e) {
        console.error('Error loading rooms:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('housekeeping_current', JSON.stringify(rooms));
  }, [rooms]);

  const updateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    setRooms(rooms.map(room => 
      room.id === roomId 
        ? { ...room, status: newStatus, lastCleaned: newStatus === 'clean' ? new Date().toLocaleString('ru-RU') : room.lastCleaned }
        : room
    ));
  };

  const assignHousekeeper = (roomId: string, housekeeper: string) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, assignedTo: housekeeper } : room
    ));
  };

  const addRoom = () => {
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
      notes: newRoom.notes || ''
    };
    
    setRooms([...rooms, room]);
    setNewRoom({
      number: '',
      floor: 1,
      status: 'dirty',
      assignedTo: '',
      checkOut: '',
      checkIn: '',
      priority: 'normal',
      notes: ''
    });
  };

  const deleteRoom = (roomId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот апартамент?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const startEditRoom = (roomId: string) => {
    setEditingRoomId(roomId);
  };

  const saveEditRoom = () => {
    setEditingRoomId(null);
  };

  const updateRoomField = (roomId: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(room => 
      room.id === roomId ? { ...room, [field]: value } : room
    ));
  };

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
