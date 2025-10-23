import { Button } from '@/components/ui/button';
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

interface GuestWithBookings extends Guest {
  bookings?: any[];
}

interface GuestDetailsPanelProps {
  guest: GuestWithBookings;
  apartmentCategories: Array<{ id: string; name: string }>;
  showPassword: { [key: number]: boolean };
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: number) => void;
  onCopy: (text: string, label: string) => void;
  onTogglePassword: (key: number) => void;
}

export default function GuestDetailsPanel({
  guest,
  apartmentCategories,
  showPassword,
  onEdit,
  onDelete,
  onCopy,
  onTogglePassword
}: GuestDetailsPanelProps) {
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white/10 border-white/20 p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">{guest.name}</h2>
          <div className="flex gap-2 flex-wrap">
            {guest.is_vip && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full">
                ⭐ VIP
              </span>
            )}
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(guest.status)}`}>
              {guest.status === 'active' ? 'Активен' : guest.status === 'blocked' ? 'Заблокирован' : 'Ожидание'}
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
              {getTypeLabel(guest.guest_type)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onEdit(guest)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Icon name="Edit" size={16} />
            Редактировать
          </Button>
          <Button
            onClick={() => onDelete(guest.id)}
            variant="outline"
            className="text-red-400 border-red-400/30 hover:bg-red-500/10"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm mb-1">Email</div>
            <div className="flex items-center gap-2">
              <span className="text-white">{guest.email}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCopy(guest.email, 'Email')}
                className="h-6 w-6 p-0 text-white/50 hover:text-white"
              >
                <Icon name="Copy" size={14} />
              </Button>
            </div>
          </div>

          {guest.username && (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Логин</div>
              <div className="flex items-center gap-2">
                <span className="text-white">@{guest.username}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCopy(guest.username!, 'Логин')}
                  className="h-6 w-6 p-0 text-white/50 hover:text-white"
                >
                  <Icon name="Copy" size={14} />
                </Button>
              </div>
            </div>
          )}

          {guest.phone && (
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Телефон</div>
              <div className="text-white">{guest.phone}</div>
            </div>
          )}

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm mb-1">Дата создания</div>
            <div className="text-white">{formatDate(guest.created_at)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="text-purple-300 text-sm mb-1">Всего броней</div>
            <div className="text-white text-2xl font-bold">{guest.total_bookings}</div>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-green-300 text-sm mb-1">Потрачено всего</div>
            <div className="text-white text-2xl font-bold">{parseFloat(guest.total_spent).toLocaleString()} ₽</div>
          </div>
        </div>

        {guest.assigned_apartments && guest.assigned_apartments.length > 0 && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-white/60 text-sm mb-2">Назначенные категории</div>
            <div className="flex flex-wrap gap-2">
              {guest.assigned_apartments.map((aptId) => {
                const apt = apartmentCategories.find(a => a.id === aptId);
                return (
                  <span key={aptId} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded">
                    {apt?.name || aptId}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {guest.admin_notes && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-yellow-300 text-sm mb-2 flex items-center gap-2">
              <Icon name="FileText" size={14} />
              Внутренние заметки
            </div>
            <div className="text-white text-sm whitespace-pre-wrap">{guest.admin_notes}</div>
          </div>
        )}

        {guest.bookings && guest.bookings.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">История бронирований ({guest.bookings.length})</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {guest.bookings.map((booking: any) => (
                <div key={booking.id} className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">
                        {booking.apartment_name || booking.room_number || `ID: ${booking.apartment_id}`}
                      </div>
                      <div className="text-white/60 text-sm">
                        {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                      </div>
                    </div>
                    {booking.total_amount && (
                      <div className="text-white font-medium">{booking.total_amount.toLocaleString()} ₽</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
