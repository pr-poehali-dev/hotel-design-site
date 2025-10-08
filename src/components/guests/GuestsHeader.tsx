import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface GuestsHeaderProps {
  onAddGuest: () => void;
  onResetPassword: () => void;
}

const GuestsHeader = ({ onAddGuest, onResetPassword }: GuestsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-charcoal-900">
          Управление гостями
        </h2>
        <p className="text-charcoal-600 mt-1">
          Создавайте аккаунты для гостей и управляйте доступом
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onResetPassword}
          variant="outline"
          className="border-gold-300 text-gold-700 hover:bg-gold-50"
        >
          <Icon name="KeyRound" size={18} className="mr-2" />
          Сбросить пароль
        </Button>
        <Button
          onClick={onAddGuest}
          className="bg-gold-500 hover:bg-gold-600"
        >
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить гостя
        </Button>
      </div>
    </div>
  );
};

export default GuestsHeader;
