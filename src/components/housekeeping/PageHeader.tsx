import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { User } from '@/components/housekeeping/types';

interface PageHeaderProps {
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
  lastSync?: Date;
  unreadNotifications?: number;
}

const PageHeader = ({ user, isAdmin, onLogout, lastSync, unreadNotifications = 0 }: PageHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl md:text-4xl font-playfair font-bold text-white mb-2">
            Таблица уборки апартаментов
          </h1>
          <p className="text-gray-400 font-inter text-sm">Управление статусами номеров</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-gold-600 text-white text-xs md:text-sm rounded-full font-semibold">
              {isAdmin ? 'Администратор' : 'Горничная'}: {user.username}
            </span>
            {!isAdmin && unreadNotifications > 0 && (
              <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full font-bold flex items-center gap-1 animate-pulse">
                <Icon name="Bell" size={14} />
                {unreadNotifications} новых
              </span>
            )}
            {lastSync && (
              <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full font-semibold flex items-center gap-1">
                <Icon name="RefreshCw" size={12} />
                {lastSync.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <p className="text-xs text-gray-400">Сегодня</p>
          <p className="text-lg md:text-xl font-semibold text-white">{new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {!isAdmin && (
          <FizzyButton
            onClick={() => {
              localStorage.setItem('housekeeper_user', JSON.stringify(user));
              window.location.href = '/payroll';
            }}
            variant="primary"
            icon={<Icon name="DollarSign" size={18} />}
            className="flex-1 md:flex-none"
          >
            Моя зарплата
          </FizzyButton>
        )}
        <FizzyButton
          onClick={onLogout}
          variant="secondary"
          icon={<Icon name="LogOut" size={18} />}
          className="flex-1 md:flex-none"
        >
          Выйти
        </FizzyButton>
      </div>
    </div>
  );
};

export default PageHeader;