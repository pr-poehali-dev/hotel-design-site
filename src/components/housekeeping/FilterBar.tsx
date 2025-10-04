import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { Room } from './types';

interface FilterBarProps {
  filter: 'all' | Room['status'];
  setFilter: (filter: 'all' | Room['status']) => void;
  selectedHousekeeper: string;
  setSelectedHousekeeper: (housekeeper: string) => void;
  housekeepers: string[];
  onAddRoom: () => void;
}

const FilterBar = ({ 
  filter, 
  setFilter, 
  selectedHousekeeper, 
  setSelectedHousekeeper, 
  housekeepers,
  onAddRoom 
}: FilterBarProps) => {
  return (
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
            onClick={onAddRoom}
            icon={<Icon name="Plus" size={20} />}
          >
            Добавить апартамент
          </FizzyButton>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
