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
      <Card className="bg-white border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {guest.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-gray-900">{guest.name}</h2>
                {guest.is_vip && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Icon name="Crown" size={14} className="mr-1" />
                    VIP
                  </Badge>
                )}
              </div>
              <p className="text-gray-500">Гость #{guest.id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              <Icon name="Edit" size={16} className="mr-2" />
              Редактировать
            </Button>
            <Button
              onClick={onDelete}
              size="sm"
              variant="destructive"
              className="bg-red-100 hover:bg-red-200 text-red-600 border-red-300"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Icon name="Calendar" size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Количество броней</p>
                <p className="text-2xl font-bold text-gray-900">{guest.bookings_count}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Icon name="DollarSign" size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Общий доход</p>
                <p className="text-2xl font-bold text-gray-900">{guest.total_revenue.toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-50 border-purple-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Icon name="Clock" size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Последний визит</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(guest.last_visit)}</p>
              </div>
            </div>
          </Card>
        </div>
      </Card>

      {(guest.login || guest.password) && (
        <Card className="bg-cyan-50 border-cyan-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="Key" size={20} className="text-cyan-600" />
            Данные для входа
          </h3>
          <div className="space-y-4">
            {guest.login && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <Icon name="User" size={18} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Логин</p>
                  <p className="text-gray-900 font-mono">{guest.login}</p>
                </div>
              </div>
            )}
            {guest.password && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <Icon name="Lock" size={18} className="text-gray-600" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Пароль</p>
                  <p className="text-gray-900 font-mono">{guest.password}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GuestDetails;
