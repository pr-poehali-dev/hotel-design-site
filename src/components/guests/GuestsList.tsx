import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Guest {
  id: number;
  email: string;
  name: string;
  phone: string;
  created_at: string;
}

interface GuestsListProps {
  guests: Guest[];
  searchQuery: string;
  onResetPassword: (email: string) => void;
  onDeleteGuest: (id: number) => void;
  onClearSearch: () => void;
}

const GuestsList = ({
  guests,
  searchQuery,
  onResetPassword,
  onDeleteGuest,
  onClearSearch,
}: GuestsListProps) => {
  if (guests.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="SearchX" size={48} className="mx-auto text-charcoal-400 mb-3" />
        <p className="text-charcoal-600">
          Ничего не найдено по запросу "{searchQuery}"
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSearch}
          className="mt-3"
        >
          Очистить поиск
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {guests.map((guest) => (
        <div
          key={guest.id}
          className="flex items-center justify-between p-4 bg-white border border-charcoal-200 rounded-lg hover:border-gold-400 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                <Icon name="User" size={20} className="text-gold-700" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">
                  {guest.name || 'Без имени'}
                </p>
                <p className="text-sm text-charcoal-600">{guest.email}</p>
                {guest.phone && (
                  <p className="text-xs text-charcoal-500">{guest.phone}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-charcoal-500">
              {new Date(guest.created_at).toLocaleDateString('ru-RU')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResetPassword(guest.email)}
              className="text-gold-600 hover:text-gold-700 hover:bg-gold-50"
            >
              <Icon name="KeyRound" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteGuest(guest.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuestsList;
