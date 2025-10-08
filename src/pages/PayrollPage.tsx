import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { useCleaningRecords } from '@/hooks/useCleaningRecords';

interface Maid {
  id: number;
  name: string;
  rate_per_cleaning: number;
  is_active: boolean;
}

interface CleaningTask {
  id: number;
  maid_id: number | null;
  cleaning_date: string;
  status: string;
  payment_amount: number | null;
}

interface PayrollReport {
  maid_id: number;
  maid_name: string;
  period_start: string;
  period_end: string;
  total_cleanings: number;
  total_amount: number;
  tasks: CleaningTask[];
}

const PayrollPage = () => {
  const navigate = useNavigate();
  const { records, loading: recordsLoading } = useCleaningRecords();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [maids, setMaids] = useState<Maid[]>([]);
  const [reports, setReports] = useState<PayrollReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const user = localStorage.getItem('housekeeper_user');
    if (!user) {
      navigate('/housekeeper-login');
      return;
    }
    setCurrentUser(JSON.parse(user));
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [selectedPeriod, records, currentUser]);

  const loadData = async () => {
    try {
      const maidsRes = await fetch('https://functions.poehali.dev/42e7ec99-c6f4-42fe-93a5-c7334cddee7f');
      const maidsData = await maidsRes.json();
      setMaids(maidsData);

      // Используем данные из БД вместо localStorage
      // Показываем ВСЕ записи, независимо от статуса оплаты
      const cleaningRecords = records;

      // Фильтруем только текущую горничную
      const currentMaid = maidsData.find((m: Maid) => m.name === currentUser?.username);
      if (!currentMaid) {
        setReports([]);
        setLoading(false);
        return;
      }

      const payrollReports = [currentMaid]
        .map((maid: Maid) => {
          const maidRecords = cleaningRecords.filter(r => {
            if (r.housekeeperName !== maid.name) return false;
            
            // Преобразуем ISO timestamp в дату YYYY-MM-DD для сравнения
            const cleanedDate = r.cleanedAt ? r.cleanedAt.split('T')[0] : '';
            return cleanedDate >= selectedPeriod.start && cleanedDate <= selectedPeriod.end;
          });

          const totalAmount = maidRecords.reduce((sum, r) => sum + (r.payment || 0), 0);

          // Преобразуем записи в формат CleaningTask для совместимости
          const tasks: CleaningTask[] = maidRecords.map(r => ({
            id: Number(r.id),
            maid_id: maid.id,
            cleaning_date: r.cleanedAt,
            status: 'completed',
            payment_amount: r.payment
          }));

          return {
            maid_id: maid.id,
            maid_name: maid.name,
            period_start: selectedPeriod.start,
            period_end: selectedPeriod.end,
            total_cleanings: maidRecords.length,
            total_amount: totalAmount,
            tasks
          };
        })
        .filter((r: PayrollReport) => r.total_cleanings > 0);

      setReports(payrollReports);
    } catch (error) {
      console.error('Error loading payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPayroll = (report: PayrollReport) => {
    const csv = [
      ['Горничная', 'Период', 'Количество уборок', 'Сумма к выплате'],
      [
        report.maid_name,
        `${new Date(report.period_start).toLocaleDateString('ru')} - ${new Date(report.period_end).toLocaleDateString('ru')}`,
        report.total_cleanings.toString(),
        `${report.total_amount.toFixed(2)} руб`
      ],
      [],
      ['Дата уборки', 'Апартамент', 'Сумма'],
      ...report.tasks.map(t => [
        new Date(t.cleaning_date).toLocaleDateString('ru'),
        t.id.toString(),
        `${(t.payment_amount || 0).toFixed(2)} руб`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `зарплата_${report.maid_name}_${report.period_start}_${report.period_end}.csv`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('housekeeper_user');
    navigate('/housekeeper-login');
  };

  const totalPayroll = reports.reduce((sum, r) => sum + r.total_amount, 0);

  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="border-b border-gold-500/20 bg-charcoal-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-montserrat">Зарплата</h1>
                  <p className="text-gray-400 text-sm">Расчет выплат горничным</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <FizzyButton
                onClick={() => window.location.href = '/maids'}
                variant="secondary"
                icon={<Icon name="Users" size={18} />}
              >
                Горничные
              </FizzyButton>
              <FizzyButton
                onClick={() => window.location.href = '/cleaning'}
                variant="secondary"
                icon={<Icon name="Calendar" size={18} />}
              >
                График
              </FizzyButton>
              <FizzyButton
                onClick={handleLogout}
                variant="secondary"
                icon={<Icon name="LogOut" size={18} />}
              >
                Выйти
              </FizzyButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Расчет зарплаты</h2>
              <p className="text-gray-400">Период: {new Date(selectedPeriod.start).toLocaleDateString('ru')} - {new Date(selectedPeriod.end).toLocaleDateString('ru')}</p>
            </div>
            <div className="flex gap-3 items-center">
              <div>
                <label className="block text-sm text-gray-400 mb-1">От</label>
                <input
                  type="date"
                  value={selectedPeriod.start}
                  onChange={(e) => setSelectedPeriod({ ...selectedPeriod, start: e.target.value })}
                  className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">До</label>
                <input
                  type="date"
                  value={selectedPeriod.end}
                  onChange={(e) => setSelectedPeriod({ ...selectedPeriod, end: e.target.value })}
                  className="px-4 py-2 bg-charcoal-800 border border-gold-500/30 text-white rounded-lg"
                />
              </div>
            </div>
          </div>

          <Card className="p-6 bg-gradient-to-br from-gold-500/10 to-gold-600/10 border-gold-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Общая сумма к выплате</p>
                <p className="text-3xl font-bold text-gold-400">{totalPayroll.toFixed(2)} руб</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Горничных</p>
                <p className="text-2xl font-bold text-white">{reports.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-gray-400">Загрузка...</p>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="p-12 text-center">
            <Icon name="DollarSign" size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2 text-white">Нет данных</h2>
            <p className="text-gray-400 mb-4">
              За выбранный период нет завершенных уборок
            </p>
            <FizzyButton onClick={() => window.location.href = '/cleaning'} icon={<Icon name="Calendar" size={18} />}>
              Перейти к графику
            </FizzyButton>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map(report => (
              <Card key={report.maid_id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Icon name="User" size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{report.maid_name}</h3>
                      <p className="text-sm text-gray-400">
                        {report.total_cleanings} уборок за период
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">К выплате</p>
                      <p className="text-2xl font-bold text-gold-400">
                        {report.total_amount.toFixed(2)} руб
                      </p>
                    </div>
                    <FizzyButton
                      onClick={() => handleExportPayroll(report)}
                      variant="secondary"
                      icon={<Icon name="Download" size={18} />}
                    >
                      Экспорт
                    </FizzyButton>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Детализация уборок</h4>
                  <div className="space-y-2">
                    {report.tasks.map(task => (
                      <div key={task.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {new Date(task.cleaning_date).toLocaleDateString('ru', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                        <span className="text-gold-400 font-mono">
                          {(task.payment_amount || 0).toFixed(2)} руб
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PayrollPage;