import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Room, Housekeeper } from './types';
import { getStatusColor, getStatusText } from './utils';

interface RoomRowProps {
  room: Room;
  housekeepers: Housekeeper[];
  editingRoomId: string | null;
  onUpdateStatus: (roomId: string, status: Room['status']) => void;
  onAssignHousekeeper: (roomId: string, housekeeper: string) => void;
  onStartEdit: (roomId: string) => void;
  onSaveEdit: () => void;
  onUpdateField: (roomId: string, field: keyof Room, value: any) => void;
  onDelete: (roomId: string) => void;
  isAdmin: boolean;
}

const RoomRow = memo(({
  room,
  housekeepers,
  editingRoomId,
  onUpdateStatus,
  onAssignHousekeeper,
  onStartEdit,
  onSaveEdit,
  onUpdateField,
  onDelete,
  isAdmin
}: RoomRowProps) => {
  const isEditing = editingRoomId === room.id;

  return (
    <tr className={`transition-colors text-sm ${
      isEditing ? 'bg-gold-900/20' : 'hover:bg-charcoal-700'
    }`}>
      <td className="px-3 py-3">
        {isEditing ? (
          <input
            type="text"
            value={room.number}
            onChange={(e) => onUpdateField(room.id, 'number', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 font-semibold w-16 text-xs"
          />
        ) : (
          <div className="flex items-center gap-2">
            {room.urgent && <Icon name="AlertCircle" size={16} className="text-red-500" />}
            <span className="text-white font-semibold">{room.number}</span>
          </div>
        )}
      </td>
      <td className="px-3 py-3 text-gray-300">
        {isEditing ? (
          <input
            type="number"
            value={room.floor}
            onChange={(e) => onUpdateField(room.id, 'floor', parseInt(e.target.value))}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 w-12 text-xs"
          />
        ) : (
          room.floor
        )}
      </td>
      <td className="px-3 py-3">
        {isEditing ? (
          <select
            value={room.status}
            onChange={(e) => onUpdateField(room.id, 'status', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-xs"
          >
            <option value="dirty">Грязно</option>
            <option value="clean">Чисто</option>
            <option value="in-progress">В процессе</option>
            <option value="cleaned">Убрано</option>
            <option value="pending-verification">На проверке</option>
            <option value="inspection">Проверка</option>
            <option value="turnover">Текучка</option>
            <option value="occupied">Живут</option>
          </select>
        ) : (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${getStatusColor(room.status)}`}>
            {getStatusText(room.status)}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        {isEditing ? (
          <select
            value={room.assignedTo}
            onChange={(e) => onUpdateField(room.id, 'assignedTo', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500 text-xs"
          >
            <option value="">Не назначена</option>
            {housekeepers.map(hk => (
              <option key={hk.id} value={hk.name}>{hk.name}</option>
            ))}
          </select>
        ) : (
          <span className="text-gray-300">
            {room.assignedTo || '—'}
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        {isEditing ? (
          <select
            value={room.urgent ? 'urgent' : 'normal'}
            onChange={(e) => onUpdateField(room.id, 'urgent', e.target.value === 'urgent')}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-xs"
          >
            <option value="normal">Несрочно</option>
            <option value="urgent">Срочно</option>
          </select>
        ) : (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
            room.urgent ? 'bg-red-600' : 'bg-gray-600'
          }`}>
            {room.urgent ? 'Срочно' : 'Несрочно'}
          </span>
        )}
      </td>
      <td className="px-3 py-3 text-gray-300 text-xs">{room.lastCleaned}</td>
      <td className="px-3 py-3 text-gray-400 text-xs max-w-[120px]">
        {isEditing ? (
          <input
            type="text"
            value={room.notes}
            onChange={(e) => onUpdateField(room.id, 'notes', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-xs w-full"
            placeholder="Примечания..."
          />
        ) : (
          <span className="truncate block">{room.notes || '—'}</span>
        )}
      </td>
      <td className="px-3 py-3 text-gray-300 text-xs">
        {isEditing ? (
          <input
            type="number"
            value={room.payment || 0}
            onChange={(e) => onUpdateField(room.id, 'payment', parseFloat(e.target.value) || 0)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-xs w-16"
            placeholder="0"
            min="0"
          />
        ) : (
          <span className="font-semibold">{room.payment || 0} ₽</span>
        )}
      </td>
      <td className="px-3 py-3">
        {isEditing ? (
          <select
            value={room.paymentStatus || 'unpaid'}
            onChange={(e) => onUpdateField(room.id, 'paymentStatus', e.target.value)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-xs"
          >
            <option value="unpaid">Не оплачено</option>
            <option value="paid">Оплачено</option>
          </select>
        ) : (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-xs font-semibold ${
              room.paymentStatus === 'paid' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <Icon name={room.paymentStatus === 'paid' ? 'CheckCircle' : 'XCircle'} size={12} />
            {room.paymentStatus === 'paid' ? 'Оплачено' : 'Не оплачено'}
          </span>
        )}
      </td>
      <td className="px-2 py-3">
        {isEditing ? (
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => onSaveEdit()}
              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
              title="Сохранить"
            >
              <Icon name="Check" size={14} />
            </button>
          </div>
        ) : (
          <div className="flex gap-1 flex-wrap">
            {room.status !== 'in-progress' && room.status !== 'cleaned' && room.status !== 'pending-verification' && (
              <button
                onClick={() => onUpdateStatus(room.id, 'in-progress')}
                className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                title="Начать уборку"
              >
                <Icon name="Play" size={14} />
              </button>
            )}
            {room.status === 'in-progress' && !isAdmin && (
              <button
                onClick={() => onUpdateStatus(room.id, 'cleaned')}
                className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
                title="Убрано"
              >
                <Icon name="Check" size={14} />
              </button>
            )}
            {(room.status === 'pending-verification' || room.status === 'cleaned' || (room.status === 'in-progress' && isAdmin)) && isAdmin && (
              <button
                onClick={() => onUpdateStatus(room.id, 'clean')}
                className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                title="Подтвердить - Чисто"
              >
                <Icon name="CheckCheck" size={14} />
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
      <td className="px-2 py-3">
        {isAdmin ? (
          <div className="flex gap-1 items-center justify-center">
            <button
              onClick={() => onStartEdit(room.id)}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all"
              title="Редактировать"
            >
              <Icon name="Pencil" size={14} />
            </button>
            <button
              onClick={() => onDelete(room.id)}
              className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all"
              title="Удалить"
            >
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">—</span>
        )}
      </td>
    </tr>
  );
});

RoomRow.displayName = 'RoomRow';

export default RoomRow;
