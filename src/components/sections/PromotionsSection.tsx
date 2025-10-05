import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  icon: string;
  type: 'hot' | 'new' | 'limited';
  endDate?: string;
  color: string;
}

const PromotionsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const promotions: Promotion[] = [
    {
      id: '1',
      title: 'Колесо фортуны',
      description: 'Получите QR-код при заезде и крутите колесо! Скидки от 5% до 50% на следующее бронирование',
      discount: 'до 50%',
      icon: 'Disc3',
      type: 'hot',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: '2',
      title: 'Приведи друга',
      description: 'Вы и ваш друг получите скидку 15% на бронирование. Действует без ограничений!',
      discount: '15%',
      icon: 'Users',
      type: 'new',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      title: 'Неделя = подарок',
      description: 'При бронировании от 7 ночей — бесплатная бутылка шампанского и поздний выезд',
      discount: 'Подарок',
      icon: 'Gift',
      type: 'limited',
      endDate: '2025-10-31',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '4',
      title: 'Фотоконкурс',
      description: 'Сделайте лучшее фото из апартаментов и выиграйте сертификат на 5000₽',
      discount: '5000₽',
      icon: 'Camera',
      type: 'new',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '5',
      title: 'Отзыв = скидка',
      description: 'Оставьте развернутый отзыв и получите промокод на 20% скидку при следующем бронировании',
      discount: '20%',
      icon: 'MessageSquare',
      type: 'hot',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      id: '6',
      title: 'Карта гостя',
      description: 'Накапливайте баллы за каждое бронирование. 10 баллов = 1 бесплатная ночь!',
      discount: 'Кэшбэк',
      icon: 'CreditCard',
      type: 'new',
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  useEffect(() => {
    const targetDate = new Date('2025-10-31T23:59:59').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getBadge = (type: string) => {
    switch (type) {
      case 'hot':
        return (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <Icon name="Flame" size={14} />
            ХИТ
          </div>
        );
      case 'new':
        return (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Icon name="Sparkles" size={14} />
            НОВОЕ
          </div>
        );
      case 'limited':
        return (
          <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
            <Icon name="Clock" size={14} />
            АКЦИЯ
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 rounded-full mb-4">
          <Icon name="Gift" size={20} />
          <span className="font-playfair font-bold">Специальные предложения</span>
        </div>
        <h2 className="text-4xl font-playfair font-bold text-charcoal-900 mb-4">
          Розыгрыши и акции для гостей
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Мы ценим каждого гостя! Участвуйте в акциях и получайте приятные бонусы и подарки
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" size={24} />
              <span className="text-sm font-semibold uppercase tracking-wider">Ограниченное предложение</span>
            </div>
            <h3 className="text-3xl font-playfair font-bold mb-2">
              Октябрьская распродажа
            </h3>
            <p className="text-white/90">
              Успейте забронировать со скидкой до конца месяца!
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.days}</div>
              <div className="text-xs uppercase">дней</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-xs uppercase">часов</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-xs uppercase">минут</div>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
              <div className="text-3xl font-bold">{timeLeft.seconds}</div>
              <div className="text-xs uppercase">секунд</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            {getBadge(promo.type)}
            
            <div className={`h-2 bg-gradient-to-r ${promo.color}`}></div>
            
            <div className="p-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${promo.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={promo.icon as any} size={32} className="text-white" />
              </div>

              <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
                {promo.title}
              </h3>

              <p className="text-gray-600 mb-4 min-h-[60px]">
                {promo.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className={`bg-gradient-to-r ${promo.color} text-white px-4 py-2 rounded-lg font-bold`}>
                  {promo.discount}
                </div>
                <button className="flex items-center gap-2 text-gold-600 font-semibold hover:gap-3 transition-all">
                  Подробнее
                  <Icon name="ArrowRight" size={18} />
                </button>
              </div>
            </div>

            <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <Icon name="Bell" size={48} className="text-gold-600 mx-auto mb-4" />
          <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-3">
            Не пропустите новые акции!
          </h3>
          <p className="text-gray-700 mb-6">
            Подпишитесь на рассылку и узнавайте первыми о специальных предложениях и розыгрышах
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gold-300 focus:border-gold-500 focus:outline-none"
            />
            <button className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center gap-2">
              <Icon name="Send" size={18} />
              Подписаться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionsSection;
