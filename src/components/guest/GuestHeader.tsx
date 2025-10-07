import Icon from '@/components/ui/icon';

interface GuestHeaderProps {
  guestName?: string;
  guestEmail?: string;
  onLogout: () => void;
}

const GuestHeader = ({ guestName, guestEmail, onLogout }: GuestHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <a 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <span className="font-playfair font-bold text-white text-xs">Premium Apartments</span>
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Icon name="LogOut" size={18} />
            <span className="text-sm font-medium">Выход</span>
          </button>
        </div>
        <div className="border-t border-white/20 pt-4">
          <h1 className="text-2xl font-bold font-playfair mb-1">Личный кабинет гостя</h1>
          <p className="text-gold-100 text-sm">
            {guestName || guestEmail ? `Добро пожаловать, ${guestName || guestEmail}!` : 'Вся информация о вашем бронировании'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;
