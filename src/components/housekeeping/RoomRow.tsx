import Icon from '@/components/ui/icon';
import { Room } from './types';
import { getStatusColor, getStatusText } from './utils';

interface RoomRowProps {
  room: Room;
  housekeepers: string[];
  editingRoomId: string | null;
  onUpdateStatus: (roomId: string, status: Room['status']) => void;
  onAssignHousekeeper: (roomId: string, housekeeper: string) => void;
  onStartEdit: (roomId: string) => void;
  onSaveEdit: () => void;
  onUpdateField: (roomId: string, field: keyof Room, value: any) => void;
  onDelete: (roomId: string) => void;
}

const RoomRow = ({
  room,
  housekeepers,
  editingRoomId,
  onUpdateStatus,
  onAssignHousekeeper,
  onStartEdit,
  onSaveEdit,
  onUpdateField,
  onDelete
}: RoomRowProps) => {
  const isEditing = editingRoomId === room.id;

  return (
    <tr className={`transition-colors ${
      isEditing ? 'bg-gold-900/20' : 'hover:bg-charcoal-700'
    }`}>
      <td className="px-6 py-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <select
              value={room.priority}
              onChange={(e) => onUpdateField(room.id, 'priority', e.target.value)}
              className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-24"
            >
              <option value="normal">Обычный</option>
              <option value="high">Высокий</option>
              <option value="low">Низкий</option>
            </select>
            <input
              type="text"
              value={room.number}
              onChange={(e) => onUpdateField(room.id, 'number', e.target.value)}
              className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 font-semibold w-20"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {room.priority === 'high' && <Icon name="AlertCircle" size={20} className="text-red-500" />}
            <span className="text-white font-semibold text-lg">{room.number}</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-gray-300">
        {isEditing ? (
          <input
            type="number"
            value={room.floor}
            onChange={(e) => onUpdateField(room.id, 'floor', parseInt(e.target.value))}
            className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 w-16"
          />
        ) : (
          room.floor
        )}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={room.status}
            onChange={(e) => onUpdateField(room.id, 'status', e.target.value)}
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
          onChange={(e) => onAssignHousekeeper(room.id, e.target.value)}
          className="bg-charcoal-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
        >
          <option value="">Не назначена</option>
          {housekeepers.map(hk => (
            <option key={hk} value={hk}>{hk}</option>
          ))}
        </select>
      </td>
      <td className="px-6 py-4 text-gray-300 text-sm">
        {isEditing ? (
          <input
            type="text"
            value={room.checkOut}
            onChange={(e) => onUpdateField(room.id, 'checkOut', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-20"
            placeholder="12:00"
          />
        ) : (
          room.checkOut || '—'
        )}
      </td>
      <td className="px-6 py-4 text-gray-300 text-sm">
        {isEditing ? (
          <input
            type="text"
            value={room.checkIn}
            onChange={(e) => onUpdateField(room.id, 'checkIn', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-20"
            placeholder="15:00"
          />
        ) : (
          room.checkIn || '—'
        )}
      </td>
      <td className="px-6 py-4 text-gray-300 text-sm">{room.lastCleaned}</td>
      <td className="px-6 py-4 text-gray-400 text-sm max-w-xs">
        {isEditing ? (
          <input
            type="text"
            value={room.notes}
            onChange={(e) => onUpdateField(room.id, 'notes', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-full"
            placeholder="Примечания..."
          />
        ) : (
          <span className="truncate block">{room.notes || '—'}</span>
        )}
      </td>
      <td className="px-4 py-4">
        {isEditing ? (
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => onSaveEdit()}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              title="Сохранить"
            >
              <Icon name="Check" size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {room.status !== 'in-progress' && (
              <button
                onClick={() => onUpdateStatus(room.id, 'in-progress')}
                className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                title="Начать уборку"
              >
                <Icon name="Play" size={14} />
              </button>
            )}
            {room.status !== 'clean' && (
              <button
                onClick={() => onUpdateStatus(room.id, 'clean')}
                className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                title="Чисто"
              >
                <Icon name="Check" size={14} />
              </button>
            )}
            {room.status !== 'dirty' && (
              <button
                onClick={() => onUpdateStatus(room.id, 'dirty')}
                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                title="Грязно"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={() => onStartEdit(room.id)}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            title="Редактировать"
          >
            <Icon name="Pencil" size={18} />
          </button>
          <button
            onClick={() => onDelete(room.id)}
            className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            title="Удалить"
          >
            <Icon name="Trash2" size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RoomRow;