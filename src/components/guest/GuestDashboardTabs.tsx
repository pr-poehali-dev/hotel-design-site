import Icon from '@/components/ui/icon';

interface GuestDashboardTabsProps {
  activeTab: 'bookings' | 'profile';
  onTabChange: (tab: 'bookings' | 'profile') => void;
}

export default function GuestDashboardTabs({ activeTab, onTabChange }: GuestDashboardTabsProps) {
  return (
    <div className="bg-white/5 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-0 md:gap-1">
          <button
            onClick={() => onTabChange('bookings')}
            className={`flex-1 md:flex-initial px-4 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-white bg-white/10 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name="Calendar" size={14} className="inline mr-1 md:mr-2" />
            <span className="hidden sm:inline">Мои брони</span>
            <span className="sm:hidden">Брони</span>
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`flex-1 md:flex-initial px-4 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-white bg-white/10 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name="User" size={14} className="inline mr-1 md:mr-2" />
            Профиль
          </button>
        </div>
      </div>
    </div>
  );
}