import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminDashboardHeaderProps {
  activeTab: 'guests' | 'commission';
  onTabChange: (tab: 'guests' | 'commission') => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSyncBnovo: () => void;
  onLogout: () => void;
  showMobileMenu: boolean;
  onToggleMobileMenu: () => void;
}

const AdminDashboardHeader = ({
  activeTab,
  onTabChange,
  isRefreshing,
  onRefresh,
  onSyncBnovo,
  onLogout,
  showMobileMenu,
  onToggleMobileMenu
}: AdminDashboardHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onToggleMobileMenu}
              className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700"
              size="sm"
            >
              <Icon name="Menu" size={20} />
            </Button>
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Users" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {activeTab === 'guests' ? 'Управление гостями' : 'Управление комиссией'}
              </h1>
              <p className="text-sm text-gray-600">Админ-панель</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onTabChange('guests')}
              className={`${activeTab === 'guests' 
                ? 'bg-gold-500 hover:bg-gold-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} hidden md:flex`
              }
              size="sm"
            >
              <Icon name="Users" size={16} />
              <span className="ml-2">Гости</span>
            </Button>
            <Button
              onClick={() => onTabChange('commission')}
              className={`${activeTab === 'commission' 
                ? 'bg-gold-500 hover:bg-gold-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} hidden md:flex`
              }
              size="sm"
            >
              <Icon name="Percent" size={16} />
              <span className="ml-2">Комиссия</span>
            </Button>
            <Button
              onClick={onSyncBnovo}
              disabled={isRefreshing}
              className="bg-blue-500 hover:bg-blue-600 text-white hidden md:flex"
              size="sm"
            >
              <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="ml-2">Синхронизация Bnovo</span>
            </Button>
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 hidden md:flex"
              size="sm"
            >
              <Icon name="RefreshCw" size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </Button>
            <Button
              onClick={onLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              size="sm"
            >
              <Icon name="LogOut" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;