import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BnovoSyncButtonProps {
  onSyncComplete?: () => void;
}

const BnovoSyncButton = ({ onSyncComplete }: BnovoSyncButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const syncBnovo = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/2faa4887-dddc-4f5a-8a48-3073dd398dbd', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Ошибка синхронизации');
      }

      const data = await response.json();
      
      if (data.success) {
        setLastSync(new Date());
        toast({
          title: 'Синхронизация завершена',
          description: `Загружено бронирований: ${data.synced_bookings}, обновлено дней в календаре: ${data.updated_calendar}`,
        });
        if (onSyncComplete) {
          onSyncComplete();
        }
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      toast({
        title: 'Ошибка синхронизации',
        description: error instanceof Error ? error.message : 'Не удалось синхронизировать данные с Bnovo',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={syncBnovo}
        disabled={loading}
        className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Синхронизация...' : 'Синхронизировать Bnovo'}
      </Button>
      
      {lastSync && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-green-500" />
          Последняя синхронизация: {lastSync.toLocaleTimeString('ru-RU')}
        </div>
      )}
    </div>
  );
};

export default BnovoSyncButton;