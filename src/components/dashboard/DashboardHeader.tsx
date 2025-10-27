import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DashboardHeaderProps {
  guestName: string;
  onLogout: () => void;
}

const DashboardHeader = ({ guestName, onLogout }: DashboardHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="User" className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold text-white">Личный кабинет</h1>
              <p className="text-xs sm:text-sm text-white/60">{guestName || 'Гость'}</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/10 text-xs sm:text-sm px-3 sm:px-4"
            size="sm"
          >
            <Icon name="LogOut" className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Выход</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
