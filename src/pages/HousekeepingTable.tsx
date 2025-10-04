import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { Room } from '@/components/housekeeping/types';
import StatsCards from '@/components/housekeeping/StatsCards';
import FilterBar from '@/components/housekeeping/FilterBar';
import AddRoomForm from '@/components/housekeeping/AddRoomForm';
import RoomsTable from '@/components/housekeeping/RoomsTable';

const HousekeepingTable = () => {
  const [rooms, setRooms] = useState<Room[]>([
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
  ]);

  const [filter, setFilter] = useState<'all' | 'clean' | 'dirty' | 'in-progress' | 'inspection'>('all');
  const [selectedHousekeeper, setSelectedHousekeeper] = useState<string>('all');
  const [isAddingRoom, setIsAddingRoom] = useState(false);
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

  const housekeepers = ['Мария', 'Елена', 'Ольга', 'Анна'];

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
    setIsAddingRoom(false);
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

  const filteredRooms = rooms.filter(room => {
    const statusMatch = filter === 'all' || room.status === filter;
    const housekeeperMatch = selectedHousekeeper === 'all' || room.assignedTo === selectedHousekeeper;
    return statusMatch && housekeeperMatch;
  });

  const stats = {
    total: rooms.length,
    clean: rooms.filter(r => r.status === 'clean').length,
    dirty: rooms.filter(r => r.status === 'dirty').length,
    inProgress: rooms.filter(r => r.status === 'in-progress').length,
    inspection: rooms.filter(r => r.status === 'inspection').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-white mb-2">
              Таблица уборки апартаментов
            </h1>
            <p className="text-gray-400 font-inter">Управление статусами номеров</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Сегодня</p>
            <p className="text-xl font-semibold text-white">{new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <StatsCards stats={stats} />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          selectedHousekeeper={selectedHousekeeper}
          setSelectedHousekeeper={setSelectedHousekeeper}
          housekeepers={housekeepers}
          onAddRoom={() => setIsAddingRoom(true)}
        />

        {isAddingRoom && (
          <AddRoomForm
            newRoom={newRoom}
            setNewRoom={setNewRoom}
            housekeepers={housekeepers}
            onSave={addRoom}
            onCancel={() => setIsAddingRoom(false)}
          />
        )}

        <RoomsTable
          rooms={filteredRooms}
          housekeepers={housekeepers}
          editingRoomId={editingRoomId}
          onUpdateStatus={updateRoomStatus}
          onAssignHousekeeper={assignHousekeeper}
          onStartEdit={startEditRoom}
          onSaveEdit={saveEditRoom}
          onUpdateField={updateRoomField}
          onDelete={deleteRoom}
        />

        <div className="mt-6 flex justify-center">
          <FizzyButton
            onClick={() => window.location.href = '/'}
            variant="secondary"
            icon={<Icon name="Home" size={20} />}
          >
            Вернуться на главную
          </FizzyButton>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingTable;
