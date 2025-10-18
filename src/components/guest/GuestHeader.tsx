import Icon from '@/components/ui/icon';

interface GuestHeaderProps {
  guestName?: string;
  guestEmail?: string;
  onLogout: () => void;
}

const GuestHeader = ({ guestName, guestEmail, onLogout }: GuestHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-gold-500 via-gold-600 to-amber-600 text-white py-4 md:py-8 shadow-xl">
      <div className="max-w-6xl mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <a 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold-200 to-gold-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl md:text-2xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gold-300 rounded-full opacity-80"></div>
            </div>
            <span className="hidden sm:inline font-playfair font-bold text-white text-xs md:text-sm">Premium Apartments</span>
          </a>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Icon name="LogOut" size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="text-xs md:text-sm font-medium">Выход</span>
          </button>
        </div>
        <div className="border-t border-white/30 pt-3 md:pt-4">
          <h1 className="text-lg md:text-2xl font-bold font-playfair mb-1">Личный кабинет гостя</h1>
          <p className="text-gold-100 text-xs md:text-sm">
            {guestName || guestEmail ? `Добро пожаловать, ${guestName || guestEmail}!` : 'Вся информация о вашем бронировании'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;