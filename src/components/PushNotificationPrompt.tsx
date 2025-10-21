import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const PushNotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      const hasAsked = localStorage.getItem('p9-notification-asked');
      const hasVisited = localStorage.getItem('p9-visited');
      
      if (!hasAsked && hasVisited && Notification.permission === 'default') {
        setTimeout(() => setShow(true), 5000);
      }
      
      if (!hasVisited) {
        localStorage.setItem('p9-visited', 'true');
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem('p9-notification-asked', 'true');
      
      if (result === 'granted') {
        await subscribeUserToPush();
        setShow(false);
        new Notification('P9 Апартаменты', {
          body: 'Отлично! Теперь вы будете получать уведомления о новых акциях и специальных предложениях',
          icon: 'https://cdn.poehali.dev/projects/71cc1cad-d51c-42e2-a128-9fd9502921a6/files/143e469d-5802-4200-9887-ffd01c3e42aa.jpg',
          badge: 'https://cdn.poehali.dev/projects/71cc1cad-d51c-42e2-a128-9fd9502921a6/files/143e469d-5802-4200-9887-ffd01c3e42aa.jpg'
        });
      }
    } catch (error) {
      console.error('Push notification error:', error);
    }
  };

  const subscribeUserToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
        )
      });
      
      console.log('Push subscription:', subscription);
      
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('p9-notification-asked', 'true');
  };

  if (!show || permission !== 'default' || !('Notification' in window)) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5">
      <Card className="p-6 bg-white shadow-2xl border-2 border-gold-500">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-amber-500 rounded-xl flex items-center justify-center">
              <Icon name="Bell" size={24} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Не пропустите акции!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Разрешите уведомления, чтобы первыми узнавать о специальных предложениях и скидках до 30%
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={requestPermission}
                className="flex-1 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-white font-semibold gap-2"
              >
                <Icon name="Check" size={16} />
                Включить
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="flex-1"
              >
                Не сейчас
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default PushNotificationPrompt;
