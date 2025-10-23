import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

interface GuestListItemProps {
  guest: Guest;
  onSelect: (guest: Guest) => void;
  onCopy: (text: string, label: string) => void;
}

export default function GuestListItem({ guest, onSelect, onCopy }: GuestListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'blocked': return 'bg-red-500/20 text-red-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vip': return 'VIP';
      case 'corporate': return 'Корпоративный';
      case 'blacklist': return 'Чёрный список';
      default: return 'Обычный';
    }
  };

  return (
    <Card
      onClick={() => onSelect(guest)}
      className="bg-white/10 border-white/20 p-4 hover:bg-white/15 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-1">{guest.name}</h3>
          <div className="flex gap-2 flex-wrap">
            {guest.is_vip && (
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                ⭐ VIP
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(guest.status)}`}>
              {guest.status === 'active' ? 'Активен' : guest.status === 'blocked' ? 'Заблокирован' : 'Ожидание'}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
              {getTypeLabel(guest.guest_type)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm text-white/70 mb-3">
        <div className="flex items-center gap-2">
          <Icon name="Mail" size={14} />
          <span>{guest.email}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(guest.email, 'Email');
            }}
            className="h-6 w-6 p-0 text-white/50 hover:text-white"
          >
            <Icon name="Copy" size={12} />
          </Button>
        </div>
        {guest.username && (
          <div className="flex items-center gap-2">
            <Icon name="User" size={14} />
            <span>@{guest.username}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(guest.username!, 'Логин');
              }}
              className="h-6 w-6 p-0 text-white/50 hover:text-white"
            >
              <Icon name="Copy" size={12} />
            </Button>
          </div>
        )}
        {guest.phone && (
          <div className="flex items-center gap-2">
            <Icon name="Phone" size={14} />
            <span>{guest.phone}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs">
        <div>
          <span className="text-white/50">Броней: </span>
          <span className="text-white font-medium">{guest.total_bookings}</span>
        </div>
        <div>
          <span className="text-white/50">Потрачено: </span>
          <span className="text-white font-medium">{parseFloat(guest.total_spent).toLocaleString()} ₽</span>
        </div>
      </div>
    </Card>
  );
}
