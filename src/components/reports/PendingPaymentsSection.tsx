import Icon from '@/components/ui/icon';
import ReportsTable from '@/components/ReportsTable';
import { BookingRecord } from '@/types/booking';

interface PendingPaymentsSectionProps {
  bookings: BookingRecord[];
  selectedMonth: string;
  commissionRate: number;
  onAddBooking?: () => void;
  onEditBooking?: (booking: BookingRecord) => void;
  onDeleteBooking?: (id: string) => void;
  onSendReport: (booking: BookingRecord) => void;
  onMarkAsPaid?: (booking: BookingRecord) => void;
}

const PendingPaymentsSection = ({
  bookings,
  selectedMonth,
  commissionRate,
  onAddBooking,
  onEditBooking,
  onDeleteBooking,
  onSendReport,
  onMarkAsPaid
}: PendingPaymentsSectionProps) => {
  const pendingBookings = bookings.filter(b => b.paymentStatus !== 'paid');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Clock" size={24} className="text-gold-600" />
          <h2 className="text-2xl font-bold text-charcoal-900">К оплате</h2>
          <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm font-medium">
            {pendingBookings.length}
          </span>
        </div>
      </div>
      <ReportsTable
        bookings={pendingBookings}
        onAddBooking={selectedMonth === 'current' ? onAddBooking : undefined}
        onEditBooking={selectedMonth === 'current' ? onEditBooking : undefined}
        onDeleteBooking={selectedMonth === 'current' ? onDeleteBooking : undefined}
        onSendReport={onSendReport}
        onMarkAsPaid={selectedMonth === 'current' ? onMarkAsPaid : undefined}
        readOnly={selectedMonth !== 'current'}
        managementCommissionRate={commissionRate}
      />
    </div>
  );
};

export default PendingPaymentsSection;
