import { memo } from 'react';
import { Room, Housekeeper } from './types';
import RoomRow from './RoomRow';
import RoomCardMobile from './RoomCardMobile';

interface RoomsTableProps {
  rooms: Room[];
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

const RoomsTable = memo(({
  rooms,
  housekeepers,
  editingRoomId,
  onUpdateStatus,
  onAssignHousekeeper,
  onStartEdit,
  onSaveEdit,
  onUpdateField,
  onDelete,
  isAdmin
}: RoomsTableProps) => {
  return (
    <>
      <div className="hidden lg:block bg-charcoal-800 rounded-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-sm">
            <thead className="bg-charcoal-900 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Номер</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Этаж</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Статус</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Клинер</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Прио</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Убрано</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Заметки</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">₽</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Оплата</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300">Действия</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-300 whitespace-nowrap">Правка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {rooms.map(room => (
                <RoomRow
                  key={room.id}
                  room={room}
                  housekeepers={housekeepers}
                  editingRoomId={editingRoomId}
                  onUpdateStatus={onUpdateStatus}
                  onAssignHousekeeper={onAssignHousekeeper}
                  onStartEdit={onStartEdit}
                  onSaveEdit={onSaveEdit}
                  onUpdateField={onUpdateField}
                  onDelete={onDelete}
                  isAdmin={isAdmin}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {rooms.map(room => (
          <RoomCardMobile
            key={`mobile-${room.id}-${Date.now()}`}
            room={room}
            housekeepers={housekeepers}
            onUpdateStatus={onUpdateStatus}
            onUpdateField={onUpdateField}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </>
  );
});

RoomsTable.displayName = 'RoomsTable';

export default RoomsTable;