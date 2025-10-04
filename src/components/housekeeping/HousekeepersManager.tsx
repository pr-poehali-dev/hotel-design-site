import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface HousekeepersManagerProps {
  housekeepers: string[];
  newHousekeeperName: string;
  setNewHousekeeperName: (name: string) => void;
  onAddHousekeeper: () => void;
  onDeleteHousekeeper: (name: string) => void;
}

const HousekeepersManager = ({
  housekeepers,
  newHousekeeperName,
  setNewHousekeeperName,
  onAddHousekeeper,
  onDeleteHousekeeper,
}: HousekeepersManagerProps) => {
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
            key={housekeeper}
            className="flex items-center justify-between bg-charcoal-700 p-4 rounded-lg border border-gray-600"
          >
            <span className="text-white font-semibold">{housekeeper}</span>
            <button
              onClick={() => onDeleteHousekeeper(housekeeper)}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              title="Удалить"
            >
              <Icon name="Trash2" size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousekeepersManager;