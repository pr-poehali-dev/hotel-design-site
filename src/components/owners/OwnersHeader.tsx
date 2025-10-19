import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface OwnersHeaderProps {
  showInvestorSection: boolean;
  isAddingNew: boolean;
  onToggleInvestorSection: () => void;
  onAddNew: () => void;
  onLogout: () => void;
}

export default function OwnersHeader({
  showInvestorSection,
  isAddingNew,
  onToggleInvestorSection,
  onAddNew,
  onLogout,
}: OwnersHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Управление собственниками</h1>
        <p className="text-slate-300">Добавляйте собственников и привязывайте их к апартаментам</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={() => navigate('/calendar')}
          variant="outline"
          className="hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Icon name="Calendar" size={20} />
          Календарь
        </Button>
        <Button 
          onClick={onToggleInvestorSection}
          variant={showInvestorSection ? "default" : "outline"}
          className="hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Icon name="Users" size={20} />
          {showInvestorSection ? 'Скрыть инвесторов' : 'Инвесторы'}
        </Button>
        <Button onClick={onAddNew} disabled={isAddingNew} className="hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:scale-100">
          <Icon name="Plus" size={20} />
          Добавить собственника
        </Button>
        <Button onClick={onLogout} variant="outline" className="hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
          <Icon name="LogOut" size={20} />
          Выйти
        </Button>
      </div>
    </div>
  );
}