import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminSearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: 'all' | 'vip' | 'regular';
  onFilterChange: (type: 'all' | 'vip' | 'regular') => void;
  onCreateGuest: () => void;
}

export default function AdminSearchAndFilters({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onCreateGuest
}: AdminSearchAndFiltersProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по имени, email, телефону..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            onClick={() => onFilterChange('all')}
            variant={filterType === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filterType === 'all' ? 'bg-white text-slate-900' : 'border-white/30 text-white hover:bg-white/10'}
          >
            Все
          </Button>
          <Button
            onClick={() => onFilterChange('vip')}
            variant={filterType === 'vip' ? 'default' : 'outline'}
            size="sm"
            className={filterType === 'vip' ? 'bg-yellow-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}
          >
            <Icon name="Crown" size={16} />
            VIP
          </Button>
          <Button
            onClick={() => onFilterChange('regular')}
            variant={filterType === 'regular' ? 'default' : 'outline'}
            size="sm"
            className={filterType === 'regular' ? 'bg-blue-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}
          >
            Обычные
          </Button>
        </div>

        <Button
          onClick={onCreateGuest}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Icon name="UserPlus" size={18} />
          <span className="hidden md:inline ml-2">Добавить гостя</span>
        </Button>
      </div>
    </Card>
  );
}
