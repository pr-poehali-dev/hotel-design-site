import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface GuestsSearchBarProps {
  searchQuery: string;
  sortOrder: 'newest' | 'oldest' | 'name';
  onSearchChange: (query: string) => void;
  onSortChange: (order: 'newest' | 'oldest' | 'name') => void;
}

const GuestsSearchBar = ({
  searchQuery,
  sortOrder,
  onSearchChange,
  onSortChange,
}: GuestsSearchBarProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" 
            />
            <Input
              placeholder="Поиск по email, имени или телефону..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortOrder === 'newest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('newest')}
              className={sortOrder === 'newest' ? 'bg-gold-500 hover:bg-gold-600' : ''}
            >
              <Icon name="ArrowDownWideNarrow" size={16} className="mr-2" />
              Новые
            </Button>
            <Button
              variant={sortOrder === 'oldest' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('oldest')}
              className={sortOrder === 'oldest' ? 'bg-gold-500 hover:bg-gold-600' : ''}
            >
              <Icon name="ArrowUpWideNarrow" size={16} className="mr-2" />
              Старые
            </Button>
            <Button
              variant={sortOrder === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSortChange('name')}
              className={sortOrder === 'name' ? 'bg-gold-500 hover:bg-gold-600' : ''}
            >
              <Icon name="SortAsc" size={16} className="mr-2" />
              Имя
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestsSearchBar;
