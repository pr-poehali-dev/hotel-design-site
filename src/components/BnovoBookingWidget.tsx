import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

interface BnovoBookingWidgetProps {
  onClose: () => void;
}

declare global {
  interface Window {
    BookingIframe: any;
  }
}

const BnovoBookingWidget = ({ onClose }: BnovoBookingWidgetProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://widget.reservationsteps.ru/iframe/library/dist/booking_iframe.js';
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if (window.BookingIframe) {
            const BnovoBookFrame = new window.BookingIframe({
              html_id: 'booking_iframe',
              uid: 'c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981',
              lang: 'ru',
              width: 'auto',
              height: 'auto',
              rooms: '',
              IsMobile: '0',
              scroll_to_rooms: '0',
              fixed_header_selector: '',
              fixed_mobile_header_width: 800,
              fixed_mobile_header_selector: '',
              fixed_footer_selector: '',
              fixed_mobile_footer_width: 800,
              fixed_mobile_footer_selector: ''
            });
            BnovoBookFrame.init();
            setIsLoading(false);
          }
        }, 100);
      };
      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      const existingScript = document.querySelector('script[src*="booking_iframe.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 flex items-center justify-between shadow-md">
          <h2 className="text-2xl font-playfair font-bold text-white">
            Бронирование апартаментов
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
            aria-label="Закрыть"
          >
            <Icon name="X" size={24} className="text-white" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-inter">Загрузка системы бронирования...</p>
              </div>
            </div>
          )}
          
          <div id="booking_iframe" className="relative p-6">
            <div id="bn_iframe" className="font-inter absolute right-0 bottom-0 text-xs leading-none opacity-50 z-10 mt-2">
              <div className="text-blue-600">
                <a 
                  className="text-gray-500 bg-white" 
                  href="https://bnovo.ru/bnovo-mb/?utm_source=client_modul_br" 
                  id="bnovo_link" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Система управления отелем Bnovo ©
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BnovoBookingWidget;
