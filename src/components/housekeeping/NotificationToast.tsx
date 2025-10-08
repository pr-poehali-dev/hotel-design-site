import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

const NotificationToast = ({ message, type, duration = 5000, onClose }: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={24} className="text-green-400" />;
      case 'info':
        return <Icon name="Info" size={24} className="text-blue-400" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={24} className="text-yellow-400" />;
      case 'error':
        return <Icon name="XCircle" size={24} className="text-red-400" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'from-green-600 to-emerald-600 border-green-500';
      case 'info':
        return 'from-blue-600 to-cyan-600 border-blue-500';
      case 'warning':
        return 'from-yellow-600 to-orange-600 border-yellow-500';
      case 'error':
        return 'from-red-600 to-rose-600 border-red-500';
    }
  };

  return (
    <div
      className={`fixed top-8 right-8 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`bg-gradient-to-r ${getColors()} rounded-2xl px-6 py-4 shadow-2xl border-2 flex items-center gap-4 min-w-[320px] max-w-[480px]`}
      >
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <p className="text-white font-semibold text-base leading-snug">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
