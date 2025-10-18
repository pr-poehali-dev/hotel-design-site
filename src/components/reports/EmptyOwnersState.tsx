import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

const EmptyOwnersState = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-12 text-center">
      <Icon name="Users" size={48} className="mx-auto mb-4 text-gray-400" />
      <h2 className="text-2xl font-bold mb-2">Нет собственников</h2>
      <p className="text-gray-600 mb-4">
        Добавьте собственников в разделе управления для просмотра отчетов
      </p>
      <FizzyButton
        onClick={() => navigate('/owners')}
        icon={<Icon name="Plus" size={18} />}
      >
        Добавить собственника
      </FizzyButton>
    </Card>
  );
};

export default EmptyOwnersState;
