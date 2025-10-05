import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';
import BnovoBookingWidget from '@/components/BnovoBookingWidget';
import { useState } from 'react';

const BookingPromoSection = () => {
  const [showBookingWidget, setShowBookingWidget] = useState(false);

  return (
    <section className="py-20 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-2 border-gold-500/40 rounded-3xl p-12 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-500/20 rounded-full mb-4">
                <Icon name="Calendar" size={40} className="text-gold-400" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Готовы забронировать?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 font-inter leading-relaxed">
              Лучшие апартаменты премиум-класса ждут вас. <br />
              Бронируйте напрямую и получайте лучшие условия.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <FizzyButton
                onClick={() => setShowBookingWidget(true)}
                icon={<Icon name="Sparkles" size={20} />}
                className="text-lg px-8 py-6"
              >
                Забронировать сейчас
              </FizzyButton>
              
              <a 
                href="https://t.me/apartamentsmsk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-300 font-semibold"
              >
                <Icon name="Send" size={20} />
                Написать в Telegram
              </a>
            </div>

            <div className="mt-10 pt-10 border-t border-gold-500/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <Icon name="Shield" size={32} className="text-gold-400 mb-2" />
                  <p className="text-gray-300 font-inter text-sm">Безопасное бронирование</p>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="CreditCard" size={32} className="text-gold-400 mb-2" />
                  <p className="text-gray-300 font-inter text-sm">Оплата картой онлайн</p>
                </div>
                <div className="flex flex-col items-center">
                  <Icon name="Clock" size={32} className="text-gold-400 mb-2" />
                  <p className="text-gray-300 font-inter text-sm">Мгновенное подтверждение</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingWidget && (
        <BnovoBookingWidget onClose={() => setShowBookingWidget(false)} />
      )}
    </section>
  );
};

export default BookingPromoSection;
