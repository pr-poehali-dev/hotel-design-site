import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AdminEmptyState() {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <Icon name="UserSearch" size={40} className="text-white/40" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Выберите гостя</h3>
      <p className="text-white/60 max-w-sm">
        Нажмите на гостя из списка слева, чтобы увидеть детали и управлять данными
      </p>
    </Card>
  );
}
