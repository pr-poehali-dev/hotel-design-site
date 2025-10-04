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
          <div className="flex flex-wrap gap-4 items-center justify-between">
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
            <div>
              <FizzyButton
                onClick={() => setIsAddingRoom(true)}
                icon={<Icon name="Plus" size={20} />}
              >
                Добавить апартамент
              </FizzyButton>
            </div>
          </div>
        </div>

        {isAddingRoom && (
          <div className="bg-charcoal-800 rounded-xl p-6 mb-6 border border-gold-500">
            <h3 className="text-xl font-semibold text-white mb-4">Добавить новый апартамент</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Номер*</label>
                <input
                  type="text"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                  placeholder="501"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Этаж</label>
                <input
                  type="number"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Статус</label>
                <select
                  value={newRoom.status}
                  onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as Room['status'] })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                >
                  <option value="dirty">Грязно</option>
                  <option value="clean">Чисто</option>
                  <option value="in-progress">В процессе</option>
                  <option value="inspection">Проверка</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Приоритет</label>
                <select
                  value={newRoom.priority}
                  onChange={(e) => setNewRoom({ ...newRoom, priority: e.target.value as Room['priority'] })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                >
                  <option value="normal">Обычный</option>
                  <option value="high">Высокий</option>
                  <option value="low">Низкий</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Время выезда</label>
                <input
                  type="text"
                  value={newRoom.checkOut}
                  onChange={(e) => setNewRoom({ ...newRoom, checkOut: e.target.value })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                  placeholder="12:00"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Время заезда</label>
                <input
                  type="text"
                  value={newRoom.checkIn}
                  onChange={(e) => setNewRoom({ ...newRoom, checkIn: e.target.value })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                  placeholder="15:00"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Горничная</label>
                <select
                  value={newRoom.assignedTo}
                  onChange={(e) => setNewRoom({ ...newRoom, assignedTo: e.target.value })}
                  className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                >
                  <option value="">Не назначена</option>
                  {housekeepers.map(hk => (
                    <option key={hk} value={hk}>{hk}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Примечания</label>
              <textarea
                value={newRoom.notes}
                onChange={(e) => setNewRoom({ ...newRoom, notes: e.target.value })}
                className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
                rows={2}
                placeholder="Дополнительная информация..."
              />
            </div>
            <div className="flex gap-3">
              <FizzyButton onClick={addRoom} icon={<Icon name="Check" size={20} />}>
                Сохранить
              </FizzyButton>
              <FizzyButton onClick={() => setIsAddingRoom(false)} variant="secondary" icon={<Icon name="X" size={20} />}>
                Отмена
              </FizzyButton>
            </div>
          </div>
        )}

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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredRooms.map(room => (
                  <tr key={room.id} className={`transition-colors ${
                    editingRoomId === room.id ? 'bg-gold-900/20' : 'hover:bg-charcoal-700'
                  }`}>
                    <td className="px-6 py-4">
                      {editingRoomId === room.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={room.priority}
                            onChange={(e) => updateRoomField(room.id, 'priority', e.target.value)}
                            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-24"
                          >
                            <option value="normal">Обычный</option>
                            <option value="high">Высокий</option>
                            <option value="low">Низкий</option>
                          </select>
                          <input
                            type="text"
                            value={room.number}
                            onChange={(e) => updateRoomField(room.id, 'number', e.target.value)}
                            className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 font-semibold w-20"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(room.priority)}
                          <span className="text-white font-semibold text-lg">{room.number}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {editingRoomId === room.id ? (
                        <input
                          type="number"
                          value={room.floor}
                          onChange={(e) => updateRoomField(room.id, 'floor', parseInt(e.target.value))}
                          className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 w-16"
                        />
                      ) : (
                        room.floor
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingRoomId === room.id ? (
                        <select
                          value={room.status}
                          onChange={(e) => updateRoomField(room.id, 'status', e.target.value)}
                          className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
                        >
                          <option value="dirty">Грязно</option>
                          <option value="clean">Чисто</option>
                          <option value="in-progress">В процессе</option>
                          <option value="inspection">Проверка</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(room.status)}`}>
                          {getStatusText(room.status)}
                        </span>
                      )}
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
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {editingRoomId === room.id ? (
                        <input
                          type="text"
                          value={room.checkOut}
                          onChange={(e) => updateRoomField(room.id, 'checkOut', e.target.value)}
                          className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-20"
                          placeholder="12:00"
                        />
                      ) : (
                        room.checkOut || '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {editingRoomId === room.id ? (
                        <input
                          type="text"
                          value={room.checkIn}
                          onChange={(e) => updateRoomField(room.id, 'checkIn', e.target.value)}
                          className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-20"
                          placeholder="15:00"
                        />
                      ) : (
                        room.checkIn || '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{room.lastCleaned}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm max-w-xs">
                      {editingRoomId === room.id ? (
                        <input
                          type="text"
                          value={room.notes}
                          onChange={(e) => updateRoomField(room.id, 'notes', e.target.value)}
                          className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-full"
                          placeholder="Примечания..."
                        />
                      ) : (
                        <span className="truncate block">{room.notes || '—'}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingRoomId === room.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditRoom()}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Сохранить"
                          >
                            <Icon name="Check" size={16} />
                          </button>
                        </div>
                      ) : (
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
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {editingRoomId !== room.id && (
                          <button
                            onClick={() => startEditRoom(room.id)}
                            className="p-2 bg-charcoal-700 hover:bg-gold-600 text-gray-400 hover:text-white rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Icon name="Edit" size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="p-2 bg-charcoal-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"
                          title="Удалить апартамент"
                        >
                          <Icon name="Trash2" size={16} />
                        </button>
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