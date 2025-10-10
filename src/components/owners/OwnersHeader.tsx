import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Управление собственниками</h1>
        <p className="text-slate-300">Добавляйте собственников и привязывайте их к апартаментам</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={onToggleInvestorSection}
          variant={showInvestorSection ? "default" : "outline"}
        >
          <Icon name="Users" size={20} />
          {showInvestorSection ? 'Скрыть инвесторов' : 'Инвесторы'}
        </Button>
        <Button onClick={onAddNew} disabled={isAddingNew}>
          <Icon name="Plus" size={20} />
          Добавить собственника
        </Button>
        <Button onClick={onLogout} variant="outline">
          <Icon name="LogOut" size={20} />
          Выйти
        </Button>
      </div>
    </div>
  );
}
