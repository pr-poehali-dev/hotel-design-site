import GuestCard from '@/components/admin-guests/GuestCard';
import Icon from '@/components/ui/icon';
import { Guest } from '@/types/guest';

interface GuestsListProps {
  guests: Guest[];
  selectedGuest: Guest | null;
  onSelectGuest: (guest: Guest) => void;
}

const GuestsList = ({ guests, selectedGuest, onSelectGuest }: GuestsListProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="font-medium">Найдено: {guests.length}</span>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
        {guests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Icon name="Users" size={48} className="mb-3 opacity-50" />
            <p className="text-sm">Гости не найдены</p>
          </div>
        ) : (
          guests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              isSelected={selectedGuest?.id === guest.id}
              onClick={() => onSelectGuest(guest)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GuestsList;
