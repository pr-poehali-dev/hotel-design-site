import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmptyGuestsStateProps {
  onAddGuest: () => void;
}

const EmptyGuestsState = ({ onAddGuest }: EmptyGuestsStateProps) => {
  return (
    <Card className="border-dashed border-2 border-charcoal-300">
      <CardContent className="py-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gold-100 mx-auto mb-4 flex items-center justify-center">
            <Icon name="Users" size={32} className="text-gold-600" />
          </div>
          <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
            Нет гостей
          </h3>
          <p className="text-charcoal-600 mb-4">
            Создайте первого гостя, чтобы начать работу
          </p>
          <Button
            onClick={onAddGuest}
            className="bg-gold-500 hover:bg-gold-600"
          >
            <Icon name="UserPlus" size={18} className="mr-2" />
            Добавить гостя
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyGuestsState;
