import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BnovoSyncSettings = () => {
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncStats, setSyncStats] = useState({
    synced_bookings: 0,
    updated_calendar: 0,
    total_bookings: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Загружаем настройки из localStorage
    const enabled = localStorage.getItem('bnovo_auto_sync_enabled');
    if (enabled !== null) {
      setAutoSyncEnabled(enabled === 'true');
    }
  }, []);

  const handleAutoSyncToggle = (enabled: boolean) => {
    setAutoSyncEnabled(enabled);
    localStorage.setItem('bnovo_auto_sync_enabled', enabled.toString());
    
    toast({
      title: enabled ? 'Автосинхронизация включена' : 'Автосинхронизация выключена',
      description: enabled 
        ? 'Бронирования будут обновляться автоматически каждый час' 
        : 'Автоматическое обновление отключено',
    });
  };

  const runSync = async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('https://functions.poehali.dev/3db1fcfb-2f3e-4cf4-bf62-c73636a166f6', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Ошибка синхронизации');
      }

      const data = await response.json();
      
      if (data.success) {
        setSyncStatus('success');
        setLastSyncTime(new Date().toLocaleString('ru-RU'));
        setSyncStats({
          synced_bookings: data.synced_bookings || 0,
          updated_calendar: data.updated_calendar || 0,
          total_bookings: data.total_bookings_from_bnovo || 0
        });
        
        toast({
          title: 'Синхронизация завершена',
          description: `Загружено бронирований: ${data.synced_bookings}, обновлено дней: ${data.updated_calendar}`,
        });

        // Перезагружаем календарь через 2 секунды
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      setSyncStatus('error');
      toast({
        title: 'Ошибка синхронизации',
        description: error instanceof Error ? error.message : 'Не удалось синхронизировать данные с Bnovo',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gold-50 border-gold-200">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-charcoal-900 mb-1">
            Синхронизация с Bnovo
          </h3>
          <p className="text-sm text-charcoal-600">
            Автоматическое обновление бронирований и календаря
          </p>
        </div>
        <Activity className="w-8 h-8 text-gold-500" />
      </div>

      <div className="space-y-4">
        {/* Автосинхронизация */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gold-100">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold-500" />
            <div>
              <p className="font-medium text-charcoal-900">Автоматическая синхронизация</p>
              <p className="text-sm text-charcoal-600">Обновление каждый час</p>
            </div>
          </div>
          <Switch
            checked={autoSyncEnabled}
            onCheckedChange={handleAutoSyncToggle}
          />
        </div>

        {/* Ручная синхронизация */}
        <div className="p-4 bg-white rounded-lg border border-gold-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-charcoal-900">Синхронизировать сейчас</p>
              <p className="text-sm text-charcoal-600">
                {lastSyncTime ? `Последняя: ${lastSyncTime}` : 'Синхронизация ещё не запускалась'}
              </p>
            </div>
            <Button
              onClick={runSync}
              disabled={syncStatus === 'syncing'}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Синхронизация...' : 'Запустить'}
            </Button>
          </div>

          {/* Статус */}
          {syncStatus !== 'idle' && (
            <div className={`flex items-center gap-2 text-sm p-2 rounded ${
              syncStatus === 'success' ? 'bg-green-50 text-green-700' :
              syncStatus === 'error' ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {syncStatus === 'success' && <CheckCircle className="w-4 h-4" />}
              {syncStatus === 'error' && <XCircle className="w-4 h-4" />}
              {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>
                {syncStatus === 'success' && 'Синхронизация завершена успешно'}
                {syncStatus === 'error' && 'Ошибка синхронизации'}
                {syncStatus === 'syncing' && 'Выполняется синхронизация...'}
              </span>
            </div>
          )}
        </div>

        {/* Статистика */}
        {syncStats.total_bookings > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg border border-gold-100 text-center">
              <p className="text-2xl font-bold text-gold-600">{syncStats.total_bookings}</p>
              <p className="text-xs text-charcoal-600">Всего в Bnovo</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gold-100 text-center">
              <p className="text-2xl font-bold text-green-600">{syncStats.synced_bookings}</p>
              <p className="text-xs text-charcoal-600">Загружено</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gold-100 text-center">
              <p className="text-2xl font-bold text-blue-600">{syncStats.updated_calendar}</p>
              <p className="text-xs text-charcoal-600">Обновлено</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BnovoSyncSettings;