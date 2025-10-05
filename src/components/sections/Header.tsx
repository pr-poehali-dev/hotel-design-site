import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

interface HeaderProps {
  navigation: Array<{ id: string; label: string; icon: string }>;
  currentSection: string;
  onNavigate: (section: string) => void;
}

const Header = ({ navigation, currentSection, onNavigate }: HeaderProps) => {
  return (
    <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
      <div className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          <a 
            href="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <h1 className="font-playfair font-bold text-gold-400 py-0 px-0 text-base">Premium Apartments</h1>
          </a>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-2">
              {navigation.map((item) => (
                <FizzyButton
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'booking') {
                      window.open('https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&utm_source=share_from_pms&scroll_to_rooms=1&token=07f1a&is_auto_search=0&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=0&insidePopup=0&dfrom=29-12-2025&dto=31-12-2025&adults=1', '_blank');
                    } else if (item.id === 'reports') {
                      window.location.href = '/reports';
                    } else if (item.id === 'housekeeping') {
                      window.location.href = '/housekeeping';
                    } else if (item.id === 'bookings-admin') {
                      window.location.href = '/bookings';
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  variant={currentSection === item.id ? 'primary' : 'secondary'}
                  icon={<Icon name={item.icon as any} size={16} />}
                  className="text-sm"
                >
                  {item.label}
                </FizzyButton>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;