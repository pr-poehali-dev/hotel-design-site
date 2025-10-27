import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAddGuest }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute left-0 top-16 bottom-0 w-64 bg-white p-4 shadow-xl">
        <Button
          onClick={() => {
            onAddGuest();
            onClose();
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Новый гость
        </Button>
      </div>
    </div>
  );
};

export default MobileMenu;
