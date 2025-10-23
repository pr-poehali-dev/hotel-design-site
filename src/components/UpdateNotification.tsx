import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface UpdateNotificationProps {
  show: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export default function UpdateNotification({ show, onUpdate, onDismiss }: UpdateNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setTimeout(() => setIsVisible(true), 100);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 pointer-events-none">
      <Card
        className={`max-w-md w-full bg-gradient-to-br from-purple-600 to-pink-600 border-0 shadow-2xl pointer-events-auto transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Icon name="RefreshCw" size={24} className="text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                Доступна новая версия!
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Мы обновили приложение. Обновите страницу, чтобы получить последние улучшения.
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={onUpdate}
                  className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
                >
                  <Icon name="RefreshCw" size={16} />
                  Обновить сейчас
                </Button>
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  Позже
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
