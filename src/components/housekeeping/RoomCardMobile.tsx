import { memo } from 'react';
import Icon from '@/components/ui/icon';
import { Room } from './types';
import { getStatusColor, getStatusText } from './utils';

interface RoomCardMobileProps {
  room: Room;
  onUpdateStatus: (roomId: string, status: Room['status']) => void;
  isAdmin: boolean;
}

const RoomCardMobile = memo(({
  room,
  onUpdateStatus,
  isAdmin
}: RoomCardMobileProps) => {
  return (
    <div className="bg-gradient-to-br from-charcoal-800 to-charcoal-900 rounded-2xl p-5 border-2 border-gold-600/30 shadow-xl">
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
        
        {room.status !== 'in-progress' && room.status !== 'cleaned' && room.status !== 'pending-verification' && room.status !== 'clean' && (
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
  );
});

RoomCardMobile.displayName = 'RoomCardMobile';

export default RoomCardMobile;
