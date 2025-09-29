import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-gold-400">Premium Apartments</h3>
            </div>
            <p className="text-gray-300 font-inter">
              Премиальные апартаменты в самом сердце Москвы. Ваш комфорт - наш приоритет.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-300 font-inter">
              <li>Бронирование апартаментов</li>
              <li>Ресторан и бар</li>
              <li>Конференц-залы</li>
              <li>Спа и фитнес</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Социальные сети</h4>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                <Icon name="Facebook" size={20} />
              </Button>
              <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                <Icon name="Twitter" size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-charcoal-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-inter">
            © 2024 Premium Apartments. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;