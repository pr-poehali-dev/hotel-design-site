import Icon from '@/components/ui/icon';
import { GlowIconButton } from '@/components/ui/glow-icon-button';
import { FizzyButton } from '@/components/ui/fizzy-button';
import BnovoBookingWidget from '@/components/BnovoBookingWidget';
import { useState } from 'react';

const Footer = () => {
  const [showBookingWidget, setShowBookingWidget] = useState(false);

  return (
    <footer className="bg-charcoal-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border border-gold-500/30 rounded-2xl p-8">
            <h3 className="text-3xl font-playfair font-bold text-gold-400 mb-3">
              Готовы забронировать?
            </h3>
            <p className="text-gray-300 mb-6 font-inter">
              Лучшие апартаменты премиум-класса ждут вас
            </p>
            <FizzyButton
              onClick={() => setShowBookingWidget(true)}
              icon={<Icon name="Calendar" size={20} />}
              className="inline-flex"
            >
              Забронировать сейчас
            </FizzyButton>
          </div>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Телеграмм</h4>
          <div className="flex justify-center">
            <GlowIconButton 
              href="https://t.me/apartamentsmsk"
              icon={<Icon name="Send" size={24} />}
              glowColor="#ffee10"
            />
          </div>
        </div>
        
        <div className="border-t border-charcoal-700 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center md:text-left">
              <h5 className="text-gold-400 font-playfair font-semibold mb-3">Для гостей</h5>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="block text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  Бронирование
                </a>
                <a 
                  href="#" 
                  className="block text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  Апартаменты
                </a>
                <a 
                  href="#" 
                  className="block text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  Контакты
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-gold-400 font-playfair font-semibold mb-3">Для партнёров</h5>
              <div className="space-y-2">
                <a 
                  href="/owner-login" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  <Icon name="LogIn" size={14} />
                  Вход для инвесторов
                </a>
                <a 
                  href="/housekeeping" 
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  <Icon name="ClipboardList" size={14} />
                  Система клинеров
                </a>
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-gold-400 font-playfair font-semibold mb-3">Администрирование</h5>
              <div className="space-y-2">
                <a 
                  href="/reports" 
                  className="block text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  <Icon name="FileText" size={14} className="inline mr-1" />
                  Системный вход
                </a>
                <a 
                  href="/admin-login" 
                  className="block text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  <Icon name="Settings" size={14} className="inline mr-1" />
                  Управление гостями
                </a>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-charcoal-800">
            <p className="text-gray-500 font-inter text-sm">
              © 2024 Premium Apartments. Все права защищены.
            </p>
          </div>
        </div>
      </div>

      {showBookingWidget && (
        <BnovoBookingWidget onClose={() => setShowBookingWidget(false)} />
      )}
    </footer>
  );
};

export default Footer;