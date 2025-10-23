import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminDashboardHeaderProps {
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
}

export default function AdminDashboardHeader({
  isMobileMenuOpen,
  onToggleMobileMenu,
  onLogout
}: AdminDashboardHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Icon name="Users" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Управление гостями</h1>
              <p className="text-xs text-white/60 hidden md:block">Админ-панель</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggleMobileMenu}
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
            
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="hidden md:flex text-white hover:bg-white/10"
            >
              <Icon name="LogOut" size={18} />
              <span className="hidden lg:inline ml-2">Выход</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
