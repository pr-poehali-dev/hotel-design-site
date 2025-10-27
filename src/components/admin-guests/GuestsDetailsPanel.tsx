import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import GuestDetails from '@/components/admin-guests/GuestDetails';
import { Guest } from '@/types/guest';

interface GuestsDetailsPanelProps {
  selectedGuest: Guest | null;
  showMobileDetails: boolean;
  onCloseMobileDetails: () => void;
  onEdit: () => void;
  onDelete: (guest: Guest) => void;
  onUpdate: (guest: Guest) => void;
}

const GuestsDetailsPanel = ({
  selectedGuest,
  showMobileDetails,
  onCloseMobileDetails,
  onEdit,
  onDelete,
  onUpdate
}: GuestsDetailsPanelProps) => {
  return (
    <div className={`lg:col-span-2 ${showMobileDetails ? 'fixed inset-0 z-50 bg-white overflow-y-auto p-4 lg:relative lg:inset-auto lg:z-0 lg:p-0' : 'hidden lg:block'}`}>
      {showMobileDetails && (
        <Button
          onClick={onCloseMobileDetails}
          className="lg:hidden mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
          size="sm"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
      )}
      {selectedGuest ? (
        <GuestDetails
          guest={selectedGuest}
          onEdit={onEdit}
          onDelete={() => onDelete(selectedGuest)}
          onUpdate={onUpdate}
        />
      ) : (
        <div className="flex items-center justify-center h-96">
          <div className="text-center text-gray-500">
            <Icon name="Users" size={64} className="mx-auto mb-4 opacity-50" />
            <p>Выберите гостя для просмотра деталей</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsDetailsPanel;
