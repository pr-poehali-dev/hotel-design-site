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
        
        <div className="border-t border-charcoal-700 mt-8 pt-8 text-center space-y-4">
          <div className="flex justify-center gap-6">
            <a 
              href="/reports" 
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm font-inter"
            >
              <Icon name="FileText" size={16} />
              Системный вход
            </a>
            <a 
              href="/owner-login" 
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm font-inter"
            >
              <Icon name="LogIn" size={16} />
              Вход для инвесторов
            </a>
          </div>
          <p className="text-gray-400 font-inter">
            © 2024 Premium Apartments. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;