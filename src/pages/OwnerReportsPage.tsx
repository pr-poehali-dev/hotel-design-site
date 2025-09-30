import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Отчеты собственников</h1>
        
        <div className="space-y-6">
          {reports.map((report) => (
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

        {reports.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Отчеты не найдены
          </div>
        )}
      </div>
    </div>
  );
}
