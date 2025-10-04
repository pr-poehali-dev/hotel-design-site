import Icon from '@/components/ui/icon';
import { GlowIconButton } from '@/components/ui/glow-icon-button';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white py-12">
      <div className="container mx-auto px-6">
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
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-300 transition-colors text-sm font-inter"
                >
                  <Icon name="FileText" size={14} />
                  Системный вход
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
    </footer>
  );
};

export default Footer;