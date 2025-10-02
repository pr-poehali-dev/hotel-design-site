import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

const ProfileSection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleWhatsAppAuth = () => {
    const message = encodeURIComponent('Здравствуйте! Хочу войти в личный кабинет на сайте Premium Apartments');
    window.open(`https://wa.me/79141965172?text=${message}`, '_blank');
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 2000);
  };

  if (!isAuthenticated) {
    return (
      <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 flex items-center justify-center">
        <div className="container mx-auto px-6">
          <Card className="max-w-md mx-auto p-10 bg-white shadow-2xl border-0 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Lock" size={40} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-playfair font-bold text-charcoal-900 mb-4">
              Вход в личный кабинет
            </h2>
            
            <p className="text-charcoal-600 font-inter mb-8">
              Для доступа к личному кабинету свяжитесь с нами через WhatsApp
            </p>
            
            <FizzyButton 
              onClick={handleWhatsAppAuth}
              className="w-full bg-green-500 hover:bg-green-600 mb-4"
              icon={<Icon name="MessageCircle" size={20} />}
            >
              Войти через WhatsApp
            </FizzyButton>
            
            <p className="text-sm text-charcoal-500 font-inter">
              Мы отправим вам ссылку для входа в личный кабинет
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-white mb-4">
            Личный <span className="text-gold-400">Кабинет</span>
          </h2>
          <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Управление бронированиями и личной информацией
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl border-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                <Icon name="User" size={40} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-playfair font-bold text-charcoal-900">Профиль</h3>
                <p className="text-charcoal-600">Гость</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Имя</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="Введите ваше имя"
                />
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Телефон</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="+7 XXX XXX XX XX"
                />
              </div>
              
              <FizzyButton 
                className="w-full"
                icon={<Icon name="Save" size={18} />}
              >
                Сохранить изменения
              </FizzyButton>
            </div>
          </Card>

          <Card className="p-8 bg-white shadow-2xl border-0">
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6">Мои бронирования</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-charcoal-200 rounded-lg hover:border-gold-400 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-charcoal-900 font-inter">Премиум студия</h4>
                    <p className="text-sm text-charcoal-600">55 кв.м</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    Активно
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-charcoal-600 mb-3">
                  <Icon name="Calendar" size={16} />
                  <span>29.12.2025 - 31.12.2025</span>
                </div>
                <FizzyButton 
                  variant="secondary"
                  className="w-full text-sm"
                  icon={<Icon name="Eye" size={16} />}
                >
                  Подробнее
                </FizzyButton>
              </div>

              <div className="text-center py-8">
                <Icon name="Calendar" size={48} className="text-charcoal-300 mx-auto mb-3" />
                <p className="text-charcoal-500 font-inter">Нет активных бронирований</p>
              </div>

              <FizzyButton 
                onClick={() => window.open('https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&utm_source=share_from_pms&scroll_to_rooms=1&token=07f1a&is_auto_search=0&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=0&insidePopup=0&dfrom=29-12-2025&dto=31-12-2025&adults=1', '_blank')}
                className="w-full"
                icon={<Icon name="Plus" size={18} />}
              >
                Новое бронирование
              </FizzyButton>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;