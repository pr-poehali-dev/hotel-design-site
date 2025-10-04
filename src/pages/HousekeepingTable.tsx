import { useState } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface Room {
  id: string;
  number: string;
  floor: number;
  status: 'clean' | 'dirty' | 'in-progress' | 'inspection';
  assignedTo: string;
  lastCleaned: string;
  checkOut: string;
  checkIn: string;
  priority: 'high' | 'normal' | 'low';
  notes: string;
}

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

  const housekeepers = ['Мария', 'Елена', 'Ольга', 'Анна'];

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'clean':
        return 'bg-green-500';
      case 'dirty':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'inspection':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: Room['status']) => {
    switch (status) {
      case 'clean':
        return 'Чисто';
      case 'dirty':
        return 'Грязно';
      case 'in-progress':
        return 'В процессе';
      case 'inspection':
        return 'Проверка';
      default:
        return status;
    }
  };

  const getPriorityIcon = (priority: Room['priority']) => {
    if (priority === 'high') {
      return <Icon name="AlertCircle" size={20} className="text-red-500" />;
    }
    return null;
  };

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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-charcoal-800 rounded-xl p-4 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Всего номеров</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-charcoal-800 rounded-xl p-4 border border-green-500/30">
            <p className="text-gray-400 text-sm mb-1">Чисто</p>
            <p className="text-3xl font-bold text-green-500">{stats.clean}</p>
          </div>
          <div className="bg-charcoal-800 rounded-xl p-4 border border-red-500/30">
            <p className="text-gray-400 text-sm mb-1">Грязно</p>
            <p className="text-3xl font-bold text-red-500">{stats.dirty}</p>
          </div>
          <div className="bg-charcoal-800 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-gray-400 text-sm mb-1">В процессе</p>
            <p className="text-3xl font-bold text-yellow-500">{stats.inProgress}</p>
          </div>
          <div className="bg-charcoal-800 rounded-xl p-4 border border-blue-500/30">
            <p className="text-gray-400 text-sm mb-1">Проверка</p>
            <p className="text-3xl font-bold text-blue-500">{stats.inspection}</p>
          </div>
        </div>

        <div className="bg-charcoal-800 rounded-xl p-6 mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Фильтр по статусу</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-inter transition-all ${
                    filter === 'all' ? 'bg-gold-500 text-white' : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setFilter('dirty')}
                  className={`px-4 py-2 rounded-lg font-inter transition-all ${
                    filter === 'dirty' ? 'bg-red-500 text-white' : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
                  }`}
                >
                  Грязно
                </button>
                <button
                  onClick={() => setFilter('in-progress')}
                  className={`px-4 py-2 rounded-lg font-inter transition-all ${
                    filter === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
                  }`}
                >
                  В процессе
                </button>
                <button
                  onClick={() => setFilter('clean')}
                  className={`px-4 py-2 rounded-lg font-inter transition-all ${
                    filter === 'clean' ? 'bg-green-500 text-white' : 'bg-charcoal-700 text-gray-300 hover:bg-charcoal-600'
                  }`}
                >
                  Чисто
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Горничная</label>
              <select
                value={selectedHousekeeper}
                onChange={(e) => setSelectedHousekeeper(e.target.value)}
                className="bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
              >
                <option value="all">Все горничные</option>
                {housekeepers.map(hk => (
                  <option key={hk} value={hk}>{hk}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-charcoal-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-charcoal-900">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Номер</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Этаж</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Статус</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Горничная</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Выезд</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Заезд</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Последняя уборка</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Примечания</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRooms.map(room => (
                  <tr key={room.id} className="hover:bg-charcoal-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(room.priority)}
                        <span className="text-white font-semibold text-lg">{room.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{room.floor}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(room.status)}`}>
                        {getStatusText(room.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={room.assignedTo}
                        onChange={(e) => assignHousekeeper(room.id, e.target.value)}
                        className="bg-charcoal-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
                      >
                        <option value="">Не назначена</option>
                        {housekeepers.map(hk => (
                          <option key={hk} value={hk}>{hk}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{room.checkOut || '—'}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{room.checkIn || '—'}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{room.lastCleaned}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm max-w-xs truncate">{room.notes || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {room.status !== 'in-progress' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'in-progress')}
                            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                            title="Начать уборку"
                          >
                            <Icon name="Play" size={16} />
                          </button>
                        )}
                        {room.status !== 'clean' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'clean')}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Отметить как чистое"
                          >
                            <Icon name="Check" size={16} />
                          </button>
                        )}
                        {room.status !== 'dirty' && (
                          <button
                            onClick={() => updateRoomStatus(room.id, 'dirty')}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Отметить как грязное"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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
