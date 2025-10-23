import Icon from '@/components/ui/icon';

interface GuestDashboardTabsProps {
  activeTab: 'bookings' | 'profile';
  onTabChange: (tab: 'bookings' | 'profile') => void;
}

export default function GuestDashboardTabs({ activeTab, onTabChange }: GuestDashboardTabsProps) {
  return (
    <div className="bg-white/5 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-1">
          <button
            onClick={() => onTabChange('bookings')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'text-white bg-white/10 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name="Calendar" size={16} className="inline mr-2" />
            Мои брони
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-white bg-white/10 border-b-2 border-purple-500'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon name="User" size={16} className="inline mr-2" />
            Профиль
          </button>
        </div>
      </div>
    </div>
  );
}
