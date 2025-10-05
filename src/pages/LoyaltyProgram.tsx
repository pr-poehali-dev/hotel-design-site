import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Badge {
  id: string;
  title: string;
  requirement: string;
  benefit: string;
  icon: string;
  color: string;
  bookingsRequired: number;
  discount: string;
}

const LoyaltyProgram = () => {
  const badges: Badge[] = [
    {
      id: '1',
      title: 'Первый гость',
      requirement: 'Первое бронирование',
      benefit: 'Воспользуйтесь одним из специальных предложений в разделе акций',
      icon: 'Star',
      color: 'from-gray-400 to-gray-500',
      bookingsRequired: 1,
      discount: ''
    },
    {
      id: '2',
      title: 'Постоянник',
      requirement: 'От 3-х бронирований',
      benefit: 'Дополнительная скидка 10% к любым акциям',
      icon: 'Award',
      color: 'from-blue-500 to-cyan-500',
      bookingsRequired: 3,
      discount: '+10%'
    },
    {
      id: '3',
      title: 'Амбассадор',
      requirement: 'От 10 бронирований',
      benefit: 'Дополнительная скидка 15% к любым акциям',
      icon: 'Crown',
      color: 'from-gold-500 to-gold-600',
      bookingsRequired: 10,
      discount: '+15%'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-white to-gold-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 rounded-full mb-4">
            <Icon name="Trophy" size={20} />
            <span className="font-playfair font-bold">Программа лояльности</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
            Бейджи достижений
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Бронируйте чаще и получайте дополнительные скидки к акциям!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-3 bg-gradient-to-r ${badge.color}`}></div>
              
              <div className="p-8 text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon name={badge.icon as any} size={48} className="text-white" />
                </div>

                <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-3">
                  {badge.title}
                </h3>

                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700">
                    <Icon name="Target" size={16} />
                    {badge.requirement}
                  </div>
                </div>

                {badge.discount && (
                  <div className={`inline-block bg-gradient-to-r ${badge.color} text-white text-3xl font-bold px-6 py-3 rounded-xl mb-4 shadow-lg`}>
                    {badge.discount}
                  </div>
                )}

                <p className="text-gray-600 leading-relaxed min-h-[60px]">
                  {badge.benefit}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Icon name="Check" size={16} className="text-green-500" />
                    Автоматическое начисление
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={40} className="text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
                Как это работает?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Совершайте бронирования и автоматически получайте бейджи с дополнительными скидками. 
                Скидки суммируются с акциями! Например, акция "Неделя = подарок" + статус "Постоянник" = 
                стандартные подарки + дополнительная скидка 10% на проживание.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
            <Icon name="Gift" size={48} className="text-blue-600 mb-4" />
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-3">
              Смотрите активные акции
            </h3>
            <p className="text-gray-700 mb-6">
              Узнайте, какие специальные предложения действуют прямо сейчас
            </p>
            <Link
              to="/#promotions"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Icon name="ArrowRight" size={18} />
              К акциям
            </Link>
          </div>

          <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-2xl p-8">
            <Icon name="Home" size={48} className="text-gold-600 mb-4" />
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-3">
              Забронировать апартаменты
            </h3>
            <p className="text-gray-700 mb-6">
              Выберите подходящие апартаменты и начните копить бронирования
            </p>
            <Link
              to="/#apartments"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              <Icon name="ArrowRight" size={18} />
              К апартаментам
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:gap-3 transition-all"
          >
            <Icon name="ArrowLeft" size={18} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
