import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Guest {
  id: number;
  username: string | null;
  email: string;
  name: string;
  phone: string;
  status: string;
  guest_type: string;
  is_vip: boolean;
  total_bookings: number;
  total_spent: string;
  assigned_apartments?: string[];
  admin_notes?: string;
  created_at: string;
}

interface AdminGuestListProps {
  guests: Guest[];
  selectedGuestId: number | null;
  loading: boolean;
  isRefreshing: boolean;
  onSelectGuest: (guestId: number) => void;
}

const getGuestTypeColor = (type: string) => {
  switch (type) {
    case 'vip': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    case 'regular': return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'blacklist': return 'bg-gradient-to-r from-red-500 to-red-700';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

export default function AdminGuestList({
  guests,
  selectedGuestId,
  loading,
  isRefreshing,
  onSelectGuest
}: AdminGuestListProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 lg:p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="List" size={20} />
        Список гостей ({guests.length})
      </h2>
      
      {loading && !isRefreshing ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : guests.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="UserX" size={48} className="text-white/30 mx-auto mb-3" />
          <p className="text-white/60">Гостей не найдено</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {guests.map(guest => (
            <Card
              key={guest.id}
              onClick={() => onSelectGuest(guest.id)}
              className={`p-4 cursor-pointer transition-all hover:scale-[1.02] border-2 ${
                selectedGuestId === guest.id 
                  ? 'border-purple-500 bg-white/20' 
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full ${getGuestTypeColor(guest.guest_type)} flex items-center justify-center flex-shrink-0`}>
                  {guest.is_vip ? (
                    <Icon name="Crown" size={20} className="text-white" />
                  ) : (
                    <Icon name="User" size={20} className="text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{guest.name}</h3>
                    {guest.is_vip && (
                      <Badge className="bg-yellow-500 text-white text-xs px-1 py-0">VIP</Badge>
                    )}
                  </div>
                  <p className="text-sm text-white/70 truncate">{guest.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={12} />
                      {guest.total_bookings} броней
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="DollarSign" size={12} />
                      ${guest.total_spent}
                    </span>
                  </div>
                </div>
                
                <Icon name="ChevronRight" size={20} className="text-white/40 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}
