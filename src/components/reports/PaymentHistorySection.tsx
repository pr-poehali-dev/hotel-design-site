import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ReportsTable from '@/components/ReportsTable';
import { BookingRecord } from '@/types/booking';

interface PaymentHistorySectionProps {
  bookings: BookingRecord[];
  selectedMonth: string;
  commissionRate: number;
  onEditBooking?: (booking: BookingRecord) => void;
  onDeleteBooking?: (id: string) => void;
}

const PaymentHistorySection = ({
  bookings,
  selectedMonth,
  commissionRate,
  onEditBooking,
  onDeleteBooking
}: PaymentHistorySectionProps) => {
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const paidBookings = bookings.filter(b => b.paymentStatus === 'paid');

  if (paidBookings.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="CheckCircle2" size={24} className="text-green-600" />
          <h2 className="text-2xl font-bold text-charcoal-900">История выплат</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {paidBookings.length}
          </span>
        </div>
        <button
          onClick={() => setShowPaymentHistory(!showPaymentHistory)}
          className="text-charcoal-600 hover:text-charcoal-900 flex items-center gap-2"
        >
          {showPaymentHistory ? (
            <>
              <span>Скрыть</span>
              <Icon name="ChevronUp" size={20} />
            </>
          ) : (
            <>
              <span>Показать</span>
              <Icon name="ChevronDown" size={20} />
            </>
          )}
        </button>
      </div>
      {showPaymentHistory && (
        <div className="opacity-75">
          <ReportsTable
            bookings={paidBookings}
            onEditBooking={selectedMonth === 'current' ? onEditBooking : undefined}
            onDeleteBooking={selectedMonth === 'current' ? onDeleteBooking : undefined}
            readOnly={selectedMonth !== 'current'}
            managementCommissionRate={commissionRate}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentHistorySection;
