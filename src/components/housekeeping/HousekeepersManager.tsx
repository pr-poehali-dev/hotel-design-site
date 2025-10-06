import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { Housekeeper } from './types';
import { useState } from 'react';

interface HousekeepersManagerProps {
  housekeepers: Housekeeper[];
  newHousekeeperName: string;
  setNewHousekeeperName: (name: string) => void;
  onAddHousekeeper: () => void;
  onDeleteHousekeeper: (id: number) => void;
  onUpdateHousekeeper: (id: number, name: string, email: string, password?: string) => void;
}

const HousekeepersManager = ({
  housekeepers,
  newHousekeeperName,
  setNewHousekeeperName,
  onAddHousekeeper,
  onDeleteHousekeeper,
  onUpdateHousekeeper,
}: HousekeepersManagerProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const handleEdit = (housekeeper: Housekeeper) => {
    setEditingId(housekeeper.id);
    setEditName(housekeeper.name);
    setEditEmail(housekeeper.email || '');
    setEditPassword('');
  };

  const handleSave = (id: number) => {
    onUpdateHousekeeper(id, editName, editEmail, editPassword);
    setEditingId(null);
    setEditPassword('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditPassword('');
  };

  return (
    <div className="mb-6 bg-charcoal-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Управление клинерами</h3>
      
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={newHousekeeperName}
          onChange={(e) => setNewHousekeeperName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddHousekeeper()}
          placeholder="Имя клинера"
          className="flex-1 px-4 py-2 bg-charcoal-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gold-500"
        />
        <FizzyButton
          onClick={onAddHousekeeper}
          icon={<Icon name="Plus" size={20} />}
        >
          Добавить
        </FizzyButton>
      </div>

      <div className="space-y-2">
        {housekeepers.map((housekeeper) => (
          <div
            key={housekeeper.id}
            className="bg-charcoal-700 p-4 rounded-lg border border-gray-600"
          >
            {editingId === housekeeper.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Имя клинера"
                  className="w-full px-3 py-2 bg-charcoal-600 border border-gray-500 rounded text-white focus:outline-none focus:border-gold-500"
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email (логин для входа)"
                  className="w-full px-3 py-2 bg-charcoal-600 border border-gray-500 rounded text-white focus:outline-none focus:border-gold-500"
                />
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Новый пароль (оставьте пустым если не меняете)"
                  className="w-full px-3 py-2 bg-charcoal-600 border border-gray-500 rounded text-white focus:outline-none focus:border-gold-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(housekeeper.id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">{housekeeper.name}</div>
                  {housekeeper.email && (
                    <div className="text-sm text-gray-400 mt-1">
                      <Icon name="Mail" size={14} className="inline mr-1" />
                      {housekeeper.email}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(housekeeper)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Icon name="Edit" size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteHousekeeper(housekeeper.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousekeepersManager;