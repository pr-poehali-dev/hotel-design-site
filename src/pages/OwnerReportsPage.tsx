import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

interface OwnerReport {
  id: number;
  apartment_number: string;
  check_in_date: string;
  check_out_date: string;
  booking_sum: number;
  total_sum: number;
  commission_percent: number;
  usn_percent: number;
  commission_before_usn: number;
  commission_after_usn: number;
  remaining_before_expenses: number;
  expenses_on_operations: number;
  average_cleaning: number;
  owner_payment: number;
  payment_date: string | null;
  hot_water: number;
  chemical_cleaning: number;
  hygiene_ср_ва: number;
  transportation: number;
  utilities: number;
  other: number;
  note_to_billing: string | null;
  created_at: string;
}

export default function OwnerReportsPage() {
  const [reports, setReports] = useState<OwnerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterApartment, setFilterApartment] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9');
        if (!response.ok) {
          throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        setReports(data.reports);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center">
        <div className="text-xl text-destructive">Ошибка: {error}</div>
      </div>
    );
  }

  const apartments = useMemo(() => {
    const unique = Array.from(new Set(reports.map(r => r.apartment_number)));
    return unique.sort();
  }, [reports]);

  const months = useMemo(() => {
    const unique = Array.from(new Set(reports.map(r => {
      const date = new Date(r.check_in_date);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    })));
    return unique.sort().reverse();
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesApartment = filterApartment === 'all' || report.apartment_number === filterApartment;
      
      const reportMonth = (() => {
        const date = new Date(report.check_in_date);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      })();
      const matchesMonth = filterMonth === 'all' || reportMonth === filterMonth;
      
      const matchesSearch = searchQuery === '' || 
        report.apartment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.note_to_billing?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesApartment && matchesMonth && matchesSearch;
    });
  }, [reports, filterApartment, filterMonth, searchQuery]);

  const totalPayment = useMemo(() => {
    return filteredReports.reduce((sum, report) => sum + report.owner_payment, 0);
  }, [filteredReports]);

  const exportToExcel = () => {
    const excelData = filteredReports.map(report => ({
      'Апартамент': report.apartment_number,
      'Заселение': formatDate(report.check_in_date),
      'Выезд': formatDate(report.check_out_date),
      'Сумма бронирования': report.booking_sum,
      'Итоговая сумма': report.total_sum,
      'Комиссия %': report.commission_percent,
      'УСН %': report.usn_percent,
      'До комиссии УСН': report.commission_before_usn,
      'После комиссии': report.commission_after_usn,
      'До затрат': report.remaining_before_expenses,
      'Затраты на эксплуатацию': report.expenses_on_operations,
      'Уборка': report.average_cleaning,
      'Выплата собственнику': report.owner_payment,
      'Дата выплаты': report.payment_date ? formatDate(report.payment_date) : '',
      'Горячая вода': report.hot_water,
      'Химчистка': report.chemical_cleaning,
      'Средства гигиены': report.hygiene_ср_ва,
      'Транспорт': report.transportation,
      'ЖКХ': report.utilities,
      'Прочее': report.other,
      'Примечание': report.note_to_billing || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчеты');
    
    const fileName = `отчеты_собственников_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Отчеты собственников</h1>
        
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
              <Button onClick={exportToExcel} className="gap-2">
                <Icon name="Download" size={18} />
                Экспорт в Excel
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex justify-between items-center">
                  <span>Апартамент {report.apartment_number}</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatNumber(report.owner_payment)} ₽
                  </span>
                </CardTitle>
                <CardDescription>
                  {formatDate(report.check_in_date)} — {formatDate(report.check_out_date)}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Финансы</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Сумма бронирования:</span>
                        <span className="font-medium">{formatNumber(report.booking_sum)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Итоговая сумма:</span>
                        <span className="font-medium">{formatNumber(report.total_sum)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Комиссия:</span>
                        <span className="font-medium">{report.commission_percent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">УСН:</span>
                        <span className="font-medium">{report.usn_percent}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Комиссии и остатки</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">До комиссии УСН:</span>
                        <span className="font-medium">{formatNumber(report.commission_before_usn)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">После комиссии:</span>
                        <span className="font-medium">{formatNumber(report.commission_after_usn)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">До затрат:</span>
                        <span className="font-medium">{formatNumber(report.remaining_before_expenses)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Затраты:</span>
                        <span className="font-medium">{formatNumber(report.expenses_on_operations)} ₽</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Расходы</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Уборка:</span>
                        <span className="font-medium">{formatNumber(report.average_cleaning)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Горячая вода:</span>
                        <span className="font-medium">{formatNumber(report.hot_water)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Химчистка:</span>
                        <span className="font-medium">{formatNumber(report.chemical_cleaning)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Транспорт:</span>
                        <span className="font-medium">{formatNumber(report.transportation)} ₽</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ЖКХ:</span>
                        <span className="font-medium">{formatNumber(report.utilities)} ₽</span>
                      </div>
                      {report.other > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Прочее:</span>
                          <span className="font-medium">{formatNumber(report.other)} ₽</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {report.note_to_billing && (
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                    <h3 className="font-semibold mb-2">Примечание:</h3>
                    <p className="text-sm text-muted-foreground">{report.note_to_billing}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && reports.length > 0 && (
          <div className="text-center text-muted-foreground py-12">
            По заданным фильтрам отчеты не найдены
          </div>
        )}
        
        {reports.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Отчеты не найдены
          </div>
        )}
      </div>
    </div>
  );
}