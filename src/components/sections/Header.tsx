import Icon from '@/components/ui/icon';

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
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <h1 className="font-playfair font-bold text-gold-400 py-0 px-0 text-xs">Premium Apartments</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'booking') {
                    window.open('https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&utm_source=share_from_pms&scroll_to_rooms=1&token=07f1a&is_auto_search=0&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=0&insidePopup=0&dfrom=29-12-2025&dto=31-12-2025&adults=1', '_blank');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentSection === item.id
                    ? 'bg-gold-500 text-charcoal-900 font-semibold'
                    : 'hover:bg-charcoal-800 text-white'
                }`}
              >
                <Icon name={item.icon as any} size={18} />
                <span className="font-inter">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;