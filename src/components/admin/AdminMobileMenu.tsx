import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminMobileMenu({
  isOpen,
  onClose,
  onLogout
}: AdminMobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose}>
      <div className="absolute top-16 right-4 bg-slate-900 rounded-lg p-4 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <Icon name="LogOut" size={18} />
          <span className="ml-2">Выход</span>
        </Button>
      </div>
    </div>
  );
}
