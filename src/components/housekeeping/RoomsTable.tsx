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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Номер</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Этаж</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Статус</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Клинер</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Приоритет</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Последняя уборка</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Примечания</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Выплата</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Статус оплаты</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Действия</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 whitespace-nowrap">Управление</th>
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
            key={room.id}
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