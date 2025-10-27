import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface BookingsFilterProps {
  filter: 'all' | 'active' | 'completed';
  sortOrder: 'newest' | 'oldest';
  searchQuery: string;
  activeCount: number;
  completedCount: number;
  onFilterChange: (value: 'all' | 'active' | 'completed') => void;
  onSortOrderChange: (value: 'newest' | 'oldest') => void;
  onSearchQueryChange: (value: string) => void;
}

const BookingsFilter = ({
  filter,
  sortOrder,
  searchQuery,
  activeCount,
  completedCount,
  onFilterChange,
  onSortOrderChange,
  onSearchQueryChange
}: BookingsFilterProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 space-y-4">
      <div className="relative">
        <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
        <Input
          type="text"
          placeholder="Поиск по номеру апартаментов..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-white/60 text-xs mb-1.5 block">Фильтр</label>
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все ({activeCount + completedCount})</SelectItem>
              <SelectItem value="active">Активные ({activeCount})</SelectItem>
              <SelectItem value="completed">Завершённые ({completedCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-white/60 text-xs mb-1.5 block">Сортировка</label>
          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="oldest">Сначала старые</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BookingsFilter;
