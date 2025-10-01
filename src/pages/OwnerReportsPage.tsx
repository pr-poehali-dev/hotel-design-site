import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';
import EditReportDialog from '@/components/EditReportDialog';
import LoginForm from '@/components/LoginForm';
import UserManagement from '@/components/UserManagement';
import ImportExcelDialog from '@/components/ImportExcelDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportsContent from '@/components/reports/ReportsContent';
import { OwnerReport } from '@/components/reports/types';

export default function OwnerReportsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reports, setReports] = useState<OwnerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterApartment, setFilterApartment] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingReport, setEditingReport] = useState<OwnerReport | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('reportsAuth');
    const userStr = sessionStorage.getItem('reportsUser');
    if (authStatus === 'true' && userStr) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://functions.poehali.dev/246e3cd7-0cb5-4366-aa28-e94aa75b9080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setCurrentUser(data.user);
        sessionStorage.setItem('reportsAuth', 'true');
        sessionStorage.setItem('reportsUser', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    sessionStorage.removeItem('reportsAuth');
    sessionStorage.removeItem('reportsUser');
  };

  const fetchReports = async () => {
    if (!currentUser) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/e027968a-93da-4665-8c14-1432cbf823c9', {
        headers: {
          'X-User-Id': currentUser.id.toString()
        }
      });
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

  useEffect(() => {
    if (currentUser) {
      fetchReports();
    }
  }, [currentUser]);

  const handleEditReport = (report: OwnerReport) => {
    setEditingReport(report);
    setEditDialogOpen(true);
  };

  const handleSaveReport = () => {
    fetchReports();
  };

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

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

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

  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const headers = [
      'Апартамент',
      'Заселение',
      'Выезд',
      'Сумма бронирования',
      'Итоговая сумма',
      'Комиссия %',
      'УСН %',
      'До комиссии УСН',
      'После комиссии',
      'До затрат',
      'Затраты на эксплуатацию',
      'Уборка',
      'Выплата собственнику',
      'Дата выплаты',
      'Горячая вода',
      'Химчистка',
      'Средства гигиены',
      'Транспорт',
      'ЖКХ',
      'Прочее',
      'Примечание'
    ];

    const rows = filteredReports.map(report => [
      report.apartment_number,
      formatDate(report.check_in_date),
      formatDate(report.check_out_date),
      report.booking_sum,
      report.total_sum,
      report.commission_percent,
      report.usn_percent,
      report.commission_before_usn,
      report.commission_after_usn,
      report.remaining_before_expenses,
      report.expenses_on_operations,
      report.average_cleaning,
      report.owner_payment,
      report.payment_date ? formatDate(report.payment_date) : '',
      report.hot_water,
      report.chemical_cleaning,
      report.hygiene_ср_ва,
      report.transportation,
      report.utilities,
      report.other,
      report.note_to_billing || ''
    ]);

    const escapeCsvValue = (value: string | number) => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `отчеты_собственников_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Отчеты собственников</h1>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <Icon name="LogOut" size={18} />
            Выйти
          </Button>
        </div>

        {isAdmin ? (
          <Tabs defaultValue="reports" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="reports">Отчеты</TabsTrigger>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reports">
              <ReportsContent
                reports={reports}
                loading={loading}
                error={error}
                filterApartment={filterApartment}
                setFilterApartment={setFilterApartment}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredReports={filteredReports}
                totalPayment={totalPayment}
                exportToExcel={exportToExcel}
                exportToCSV={exportToCSV}
                onImport={() => setImportDialogOpen(true)}
                isAdmin={isAdmin}
                handleEditReport={handleEditReport}
                apartments={apartments}
                months={months}
                formatNumber={formatNumber}
                formatDate={formatDate}
              />
            </TabsContent>
            
            <TabsContent value="users">
              <UserManagement adminToken={currentUser.id.toString()} />
            </TabsContent>
          </Tabs>
        ) : (
          <ReportsContent
            reports={reports}
            loading={loading}
            error={error}
            filterApartment={filterApartment}
            setFilterApartment={setFilterApartment}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredReports={filteredReports}
            totalPayment={totalPayment}
            exportToExcel={exportToExcel}
            exportToCSV={exportToCSV}
            isAdmin={false}
            handleEditReport={handleEditReport}
            apartments={apartments}
            months={months}
            formatNumber={formatNumber}
            formatDate={formatDate}
          />
        )}

        <EditReportDialog
          report={editingReport}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveReport}
        />

        <ImportExcelDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onSuccess={fetchReports}
          adminToken={currentUser?.id.toString() || ''}
        />
      </div>
    </div>
  );
}