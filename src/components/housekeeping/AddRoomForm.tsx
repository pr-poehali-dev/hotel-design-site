import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { Room } from './types';

interface AddRoomFormProps {
  newRoom: Partial<Room>;
  setNewRoom: (room: Partial<Room>) => void;
  housekeepers: string[];
  onSave: () => void;
  onCancel: () => void;
}

const AddRoomForm = ({ newRoom, setNewRoom, housekeepers, onSave, onCancel }: AddRoomFormProps) => {
  return (
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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
          <label className="text-gray-400 text-sm mb-2 block">Клинер</label>
          <select
            value={newRoom.assignedTo}
            onChange={(e) => setNewRoom({ ...newRoom, assignedTo: e.target.value })}
            className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
          >
            <option value="">Не назначен</option>
            {housekeepers.map(hk => (
              <option key={hk} value={hk}>{hk}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Выплата (₽)</label>
          <input
            type="number"
            value={newRoom.payment || 0}
            onChange={(e) => setNewRoom({ ...newRoom, payment: parseFloat(e.target.value) || 0 })}
            className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
            placeholder="500"
            min="0"
          />
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-2 block">Статус оплаты</label>
          <select
            value={newRoom.paymentStatus || 'unpaid'}
            onChange={(e) => setNewRoom({ ...newRoom, paymentStatus: e.target.value as 'paid' | 'unpaid' })}
            className="w-full bg-charcoal-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-gold-500"
          >
            <option value="unpaid">Не оплачено</option>
            <option value="paid">Оплачено</option>
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
        <FizzyButton onClick={onSave} icon={<Icon name="Check" size={20} />}>
          Сохранить
        </FizzyButton>
        <FizzyButton onClick={onCancel} variant="secondary" icon={<Icon name="X" size={20} />}>
          Отмена
        </FizzyButton>
      </div>
    </div>
  );
};

export default AddRoomForm;