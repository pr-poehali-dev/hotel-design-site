import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { User } from '@/components/housekeeping/types';

interface PageHeaderProps {
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
}

const PageHeader = ({ user, isAdmin, onLogout }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-4xl font-playfair font-bold text-white mb-2">
          Таблица уборки апартаментов
        </h1>
        <p className="text-gray-400 font-inter">Управление статусами номеров</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="px-3 py-1 bg-gold-600 text-white text-sm rounded-full font-semibold">
            {isAdmin ? 'Администратор' : 'Горничная'}: {user.username}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Сегодня</p>
        <p className="text-xl font-semibold text-white mb-2">{new Date().toLocaleDateString('ru-RU')}</p>
        <FizzyButton
          onClick={onLogout}
          variant="secondary"
          icon={<Icon name="LogOut" size={18} />}
        >
          Выйти
        </FizzyButton>
      </div>
    </div>
  );
};

export default PageHeader;
