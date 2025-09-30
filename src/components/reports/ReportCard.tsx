import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface ReportCardProps {
  report: OwnerReport;
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
  onEdit: (report: OwnerReport) => void;
}

export default function ReportCard({ report, formatNumber, formatDate, onEdit }: ReportCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex justify-between items-center">
          <span>Апартамент {report.apartment_number}</span>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-primary">
              {formatNumber(report.owner_payment)} ₽
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onEdit(report)}
              className="gap-2"
            >
              <Icon name="Edit" size={16} />
              Редактировать
            </Button>
          </div>
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
  );
}
