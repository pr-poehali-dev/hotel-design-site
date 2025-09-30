import ReportsFilters from './ReportsFilters';
import ReportCard from './ReportCard';

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

interface ReportsContentProps {
  reports: OwnerReport[];
  loading: boolean;
  error: string | null;
  filterApartment: string;
  setFilterApartment: (value: string) => void;
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredReports: OwnerReport[];
  totalPayment: number;
  exportToExcel: () => void;
  handleEditReport: (report: OwnerReport) => void;
  apartments: string[];
  months: string[];
  formatNumber: (num: number) => string;
  formatDate: (dateStr: string) => string;
}

export default function ReportsContent({
  reports,
  loading,
  error,
  filterApartment,
  setFilterApartment,
  filterMonth,
  setFilterMonth,
  searchQuery,
  setSearchQuery,
  filteredReports,
  totalPayment,
  exportToExcel,
  handleEditReport,
  apartments,
  months,
  formatNumber,
  formatDate
}: ReportsContentProps) {
  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Ошибка: {error}</div>;
  }

  return (
    <>
      <ReportsFilters
        filterApartment={filterApartment}
        setFilterApartment={setFilterApartment}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredReports={filteredReports}
        totalPayment={totalPayment}
        exportToExcel={exportToExcel}
        apartments={apartments}
        months={months}
        formatNumber={formatNumber}
      />
      
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            formatNumber={formatNumber}
            formatDate={formatDate}
            onEdit={handleEditReport}
          />
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
    </>
  );
}
