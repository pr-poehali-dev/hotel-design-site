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
    <>
      <tr className={`hidden lg:table-row transition-colors ${
        isEditing ? 'bg-gold-900/20' : 'hover:bg-charcoal-700'
      }`}>
      <td className="px-6 py-4">
        {isEditing ? (
          <input
            type="text"
            value={room.number}
            onChange={(e) => onUpdateField(room.id, 'number', e.target.value)}
            className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 font-semibold w-20"
          />
        ) : (
          <div className="flex items-center gap-2">
            {room.urgent && <Icon name="AlertCircle" size={20} className="text-red-500" />}
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
            <option value="cleaned">Убрано</option>
            <option value="pending-verification">На проверке</option>
            <option value="inspection">Проверка</option>
            <option value="turnover">Текучка</option>
            <option value="occupied">Живут</option>
          </select>
        ) : (
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor(room.status)}`}>
            {getStatusText(room.status)}
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={room.assignedTo}
            onChange={(e) => onUpdateField(room.id, 'assignedTo', e.target.value)}
            className="bg-charcoal-700 text-white px-3 py-1 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
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
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={room.urgent ? 'urgent' : 'normal'}
            onChange={(e) => onUpdateField(room.id, 'urgent', e.target.value === 'urgent')}
            className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
          >
            <option value="normal">Несрочно</option>
            <option value="urgent">Срочно</option>
          </select>
        ) : (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-semibold ${
            room.urgent ? 'bg-red-600' : 'bg-gray-600'
          }`}>
            {room.urgent ? 'Срочно' : 'Несрочно'}
          </span>
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
      <td className="px-6 py-4 text-gray-300 text-sm">
        {isEditing ? (
          <input
            type="number"
            value={room.payment || 0}
            onChange={(e) => onUpdateField(room.id, 'payment', parseFloat(e.target.value) || 0)}
            className="bg-charcoal-700 text-white px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm w-24"
            placeholder="0"
            min="0"
          />
        ) : (
          <span className="font-semibold">{room.payment || 0} ₽</span>
        )}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select
            value={room.paymentStatus || 'unpaid'}
            onChange={(e) => onUpdateField(room.id, 'paymentStatus', e.target.value)}
            className="bg-charcoal-700 text-white px-3 py-1 rounded border border-gray-600 focus:outline-none focus:border-gold-500 text-sm"
          >
            <option value="unpaid">Не оплачено</option>
            <option value="paid">Оплачено</option>
          </select>
        ) : (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold ${
              room.paymentStatus === 'paid' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <Icon name={room.paymentStatus === 'paid' ? 'CheckCircle' : 'XCircle'} size={14} />
            {room.paymentStatus === 'paid' ? 'Оплачено' : 'Не оплачено'}
          </span>
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
      <td className="px-4 py-4">
        {isAdmin ? (
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
        ) : (
          <span className="text-gray-500 text-sm">—</span>
        )}
      </td>
    </tr>

    <div className="lg:hidden bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl p-5 border-2 border-gold-600/30 shadow-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {room.urgent && (
            <div className="bg-red-500/20 p-2 rounded-lg">
              <Icon name="AlertCircle" size={24} className="text-red-500" />
            </div>
          )}
          <div>
            <div className="text-gray-400 text-xs font-medium mb-1">Апартамент</div>
            <div className="text-white font-bold text-3xl">{room.number}</div>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg ${getStatusColor(room.status)}`}>
          {getStatusText(room.status)}
        </span>
      </div>

      <div className="bg-charcoal-700/50 rounded-xl p-4 mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-gold-500/20 p-2 rounded-lg">
            <Icon name="User" size={18} className="text-gold-500" />
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-xs mb-0.5">Клинер</div>
            <div className="text-white font-semibold text-base">{room.assignedTo || 'Не назначена'}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-lg">
            <Icon name="DollarSign" size={18} className="text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-gray-400 text-xs mb-0.5">Оплата за уборку</div>
            <div className="text-white font-bold text-lg">{room.payment || 0} ₽</div>
          </div>
        </div>

        {room.notes && (
          <div className="flex items-start gap-3 pt-2 border-t border-gray-600">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Icon name="FileText" size={18} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-gray-400 text-xs mb-1">Примечания</div>
              <div className="text-gray-300 text-sm">{room.notes}</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Управление статусом</div>
        
        {room.status !== 'in-progress' && (
          <button
            onClick={() => onUpdateStatus(room.id, 'in-progress')}
            className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon name="Play" size={22} />
            Начать уборку
          </button>
        )}
        
        {room.status === 'in-progress' && !isAdmin && (
          <button
            onClick={() => onUpdateStatus(room.id, 'cleaned')}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon name="Check" size={22} />
            Убрано - отправить на проверку
          </button>
        )}
        
        {room.status === 'pending-verification' && !isAdmin && (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-lg text-orange-400 font-semibold">
              <Icon name="Clock" size={20} />
              На проверке у администратора
            </div>
          </div>
        )}
        
        {room.status === 'pending-verification' && isAdmin && (
          <button
            onClick={() => onUpdateStatus(room.id, 'clean')}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-all font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon name="CheckCheck" size={22} />
            Подтвердить - Чисто
          </button>
        )}
        
        {room.status === 'cleaned' && !isAdmin && (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg text-emerald-400 font-semibold">
              <Icon name="Check" size={20} />
              Убрано - ожидайте проверки
            </div>
          </div>
        )}
        
        {room.status === 'clean' && (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg text-green-400 font-semibold">
              <Icon name="CheckCircle" size={20} />
              Уборка завершена
            </div>
          </div>
        )}

        {room.status !== 'dirty' && room.status !== 'clean' && room.status !== 'cleaned' && room.status !== 'pending-verification' && (
          <button
            onClick={() => onUpdateStatus(room.id, 'dirty')}
            className="w-full px-6 py-3 bg-charcoal-700 hover:bg-red-600 border-2 border-gray-600 hover:border-red-500 text-white rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Icon name="X" size={18} />
            Отменить / Грязно
          </button>
        )}
      </div>
    </div>
    </>
  );
});

RoomRow.displayName = 'RoomRow';

export default RoomRow;