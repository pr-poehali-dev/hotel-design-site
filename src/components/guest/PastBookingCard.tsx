import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Booking {
  id: string;
  apartment_id: string;
  apartment_name?: string;
  room_number?: string;
  check_in: string;
  check_out: string;
  guest_name: string;
  total_amount?: number;
  status?: string;
  created_at?: string;
}

interface PastBookingCardProps {
  booking: Booking;
  formatDate: (dateStr: string) => string;
}

export default function PastBookingCard({ booking, formatDate }: PastBookingCardProps) {
  return (
    <Card className="bg-white/5 border-white/10 p-3 md:p-4 hover:bg-white/10 transition-colors">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-white mb-1 text-sm md:text-base">
            {booking.apartment_name || booking.room_number || `Апартамент ${booking.apartment_id}`}
          </h4>
          <div className="text-xs md:text-sm text-white/60">
            {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
          {booking.total_amount && (
            <div className="text-white font-medium text-sm md:text-base">
              {booking.total_amount.toLocaleString()} ₽
            </div>
          )}
          <Button 
            size="sm" 
            variant="outline"
            className="text-white border-white/30 hover:bg-white/10 h-8"
          >
            <Icon name="RotateCcw" size={14} />
            <span className="hidden md:inline ml-1">Повторить</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}