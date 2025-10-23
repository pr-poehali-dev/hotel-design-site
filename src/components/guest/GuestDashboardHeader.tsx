import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GuestUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  username?: string;
  is_vip: boolean;
  guest_type: string;
  total_bookings: number;
  total_spent: string;
  promo_codes?: any[];
  assigned_apartments?: string[];
}

interface GuestDashboardHeaderProps {
  guestUser: GuestUser;
  onLogout: () => void;
}

export default function GuestDashboardHeader({ guestUser, onLogout }: GuestDashboardHeaderProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-white mb-2">
              Привет, {guestUser.name.split(' ')[0]}!
            </h1>
            <div className="flex gap-2 flex-wrap">
              {guestUser.is_vip && (
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs md:text-sm rounded-full">
                  ⭐ VIP
                </span>
              )}
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs md:text-sm rounded-full">
                {guestUser.total_bookings} {guestUser.total_bookings === 1 ? 'бронь' : 'броней'}
              </span>
            </div>
          </div>
          <Button 
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10 self-end md:self-auto"
          >
            <Icon name="LogOut" size={16} />
            <span className="hidden md:inline">Выход</span>
          </Button>
        </div>
      </div>
    </div>
  );
}