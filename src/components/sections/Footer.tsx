import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Телеграмм</h4>
          <div className="flex justify-center">
            <a href="https://t.me/apartamentsmsk" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                <Icon name="Send" size={20} />
              </Button>
            </a>
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