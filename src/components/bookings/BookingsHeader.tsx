import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

const BookingsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
            <div className="border-l border-white/30 pl-4 ml-2">
              <h1 className="text-2xl font-bold font-playfair">Управление бронированиями</h1>
              <p className="text-gold-100 text-sm">Отправка инструкций гостям</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                navigate('/admin-login');
              }}
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            onClick={() => window.location.href = '/bookings'}
          >
            <Icon name="Calendar" size={18} className="mr-2" />
            Управление бронями
          </Button>
          <Button 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            onClick={() => window.location.href = '/instructions-list'}
          >
            <Icon name="List" size={18} className="mr-2" />
            Все инструкции
          </Button>
          <Button 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            onClick={() => window.location.href = '/check-in-instructions'}
          >
            <Icon name="FileText" size={18} className="mr-2" />
            Создать инструкции
          </Button>
          <Button 
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            onClick={() => window.location.href = '/guest-dashboard'}
          >
            <Icon name="Eye" size={18} className="mr-2" />
            Посмотреть как видит гость
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingsHeader;
