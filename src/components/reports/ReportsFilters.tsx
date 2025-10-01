import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ReportsFiltersProps {
  filterApartment: string;
  setFilterApartment: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredReports: any[];
  totalPayment: number;
  exportToExcel: () => void;
  exportToCSV: () => void;
  onImport?: () => void;
  isAdmin?: boolean;
  apartments: string[];
  months: string[];
  formatNumber: (num: number) => string;
}

export default function ReportsFilters({
  filterApartment,
  setFilterApartment,
  filterMonth,
  setFilterMonth,
  searchQuery,
  setSearchQuery,
  filteredReports,
  totalPayment,
  exportToExcel,
  exportToCSV,
  onImport,
  isAdmin = false,
  apartments,
  months,
  formatNumber
}: ReportsFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Апартамент</label>
          <Select value={filterApartment} onValueChange={setFilterApartment}>
            <SelectTrigger>
              <SelectValue placeholder="Все апартаменты" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все апартаменты</SelectItem>
              {apartments.map(apt => (
                <SelectItem key={apt} value={apt}>Апартамент {apt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Месяц</label>
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Все месяцы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все месяцы</SelectItem>
              {months.map(month => {
                const [year, monthNum] = month.split('-');
                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
                return (
                  <SelectItem key={month} value={month}>{monthName}</SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Поиск</label>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск по номеру или примечанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="FileText" size={20} />
          <span className="font-medium">Найдено отчетов: {filteredReports.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Общая сумма выплат</div>
            <div className="text-2xl font-bold text-primary">{formatNumber(totalPayment)} ₽</div>
          </div>
          <div className="flex gap-2">
            {isAdmin && onImport && (
              <Button onClick={onImport} variant="secondary" className="gap-2">
                <Icon name="Upload" size={18} />
                Импорт
              </Button>
            )}
            <Button onClick={exportToExcel} className="gap-2">
              <Icon name="Download" size={18} />
              Excel
            </Button>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Icon name="FileText" size={18} />
              CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}