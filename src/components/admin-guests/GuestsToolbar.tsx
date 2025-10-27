import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { GuestFilter } from '@/types/guest';

interface GuestsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: GuestFilter;
  onFilterChange: (filter: GuestFilter) => void;
  sortOrder: 'name' | 'revenue' | 'visits';
  onSortChange: (order: 'name' | 'revenue' | 'visits') => void;
  onAddGuest: () => void;
}

const GuestsToolbar = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  onAddGuest
}: GuestsToolbarProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onAddGuest}
        className="hidden lg:flex bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        size="sm"
      >
        <Icon name="Plus" size={18} className="mr-2" />
        Новый гость
      </Button>
      <div className="relative flex-1">
        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск гостей..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-gray-200"
        />
      </div>
      <div className="flex gap-1 border border-gray-200 rounded-lg bg-white p-1">
        <Button
          onClick={() => onFilterChange('all')}
          className={filter === 'all' ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          Все
        </Button>
        <Button
          onClick={() => onFilterChange('vip')}
          className={filter === 'vip' ? 'bg-gold-100 text-gold-700' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          <Icon name="Crown" size={14} className="mr-1" />
          VIP
        </Button>
        <Button
          onClick={() => onFilterChange('regular')}
          className={filter === 'regular' ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          Обычные
        </Button>
      </div>
      <div className="hidden md:flex gap-1 border border-gray-200 rounded-lg bg-white p-1">
        <Button
          onClick={() => onSortChange('name')}
          className={sortOrder === 'name' ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          <Icon name="SortAsc" size={14} className="mr-1" />
          Имя
        </Button>
        <Button
          onClick={() => onSortChange('revenue')}
          className={sortOrder === 'revenue' ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          <Icon name="DollarSign" size={14} className="mr-1" />
          Доход
        </Button>
        <Button
          onClick={() => onSortChange('visits')}
          className={sortOrder === 'visits' ? 'bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
          variant="ghost"
          size="sm"
        >
          <Icon name="TrendingUp" size={14} className="mr-1" />
          Визиты
        </Button>
      </div>
    </div>
  );
};

export default GuestsToolbar;
