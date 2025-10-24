import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Guest } from '@/types/guest';

interface GuestCardProps {
  guest: Guest;
  isSelected: boolean;
  onClick: () => void;
}

const GuestCard = ({ guest, isSelected, onClick }: GuestCardProps) => {
  const avatarGradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
  ];

  const getAvatarGradient = () => {
    const hash = guest.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarGradients[hash % avatarGradients.length];
  };

  const getInitials = () => {
    return guest.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isSelected
          ? 'bg-gradient-to-br from-gold-50 to-gold-100 border-gold-400 shadow-lg'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient()} flex items-center justify-center text-white font-bold shadow-lg`}>
          {getInitials()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 font-semibold truncate">{guest.name}</h3>
            {guest.is_vip && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                <Icon name="Crown" size={12} className="mr-1" />
                VIP
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{guest.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1 text-gray-600">
          <Icon name="Calendar" size={14} />
          <span className="text-xs">{guest.bookings_count} броней</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Icon name="DollarSign" size={14} />
          <span className="text-xs">{guest.total_revenue.toLocaleString('ru-RU')} ₽</span>
        </div>
      </div>
    </Card>
  );
};

export default GuestCard;