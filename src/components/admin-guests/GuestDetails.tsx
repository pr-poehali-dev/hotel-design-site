import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Guest } from '@/types/guest';

interface GuestDetailsProps {
  guest: Guest;
  onEdit: () => void;
  onDelete: () => void;
}

const GuestDetails = ({ guest, onEdit, onDelete }: GuestDetailsProps) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Нет данных';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-white/10 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {guest.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">{guest.name}</h2>
                {guest.is_vip && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Icon name="Crown" size={14} className="mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
              <p className="text-white/60">Гость #{guest.id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="destructive"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Icon name="Calendar" size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Количество броней</p>
                <p className="text-2xl font-bold text-white">{guest.bookings_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Icon name="DollarSign" size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Общий доход</p>
                <p className="text-2xl font-bold text-white">{guest.total_revenue.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-500/10 backdrop-blur-sm border-purple-500/20 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Icon name="Clock" size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Последний визит</p>
                <p className="text-sm font-semibold text-white">{formatDate(guest.last_visit)}</p>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-purple-400" />
          Контактная информация
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <Icon name="Mail" size={18} className="text-white/60" />
            <div>
              <p className="text-xs text-white/50">Email</p>
              <p className="text-white">{guest.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
            <Icon name="Phone" size={18} className="text-white/60" />
            <div>
              <p className="text-xs text-white/50">Телефон</p>
              <p className="text-white">{guest.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      {guest.notes && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Icon name="FileText" size={20} className="text-purple-400" />
            Заметки
          </h3>
          <p className="text-white/80 whitespace-pre-wrap">{guest.notes}</p>
        </Card>
      )}

      <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} className="text-purple-400" />
          Дополнительно
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Дата регистрации:</span>
            <span className="text-white font-medium">{formatDate(guest.created_at)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GuestDetails;
