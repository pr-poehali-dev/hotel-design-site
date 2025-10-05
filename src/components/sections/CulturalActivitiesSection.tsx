import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Activity {
  id: string;
  title: string;
  venue: string;
  category: 'theatre' | 'exhibition' | 'tour';
  dates: string;
  price: string;
  image: string;
  description: string;
  link: string;
}

const CulturalActivitiesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Карл Брюллов. Рим – Москва – Петербург',
      venue: 'Новая Третьяковка',
      category: 'exhibition',
      dates: 'До 18 января 2026',
      price: 'от 500₽',
      image: 'https://images.unsplash.com/photo-1577720643272-265f7618c4d8?w=800&q=80',
      description: 'Масштабная выставка работ великого русского художника',
      link: 'https://www.tretyakovgallery.ru'
    },
    {
      id: '2',
      title: 'Александр Дейнека. Гимн жизни',
      venue: 'Третьяковская галерея',
      category: 'exhibition',
      dates: 'До 26 октября',
      price: 'от 500₽',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
      description: 'Произведения одного из ключевых мастеров советского искусства',
      link: 'https://www.tretyakovgallery.ru'
    },
    {
      id: '3',
      title: 'Жил. Был. Дом.',
      venue: 'МХТ им. Чехова',
      category: 'theatre',
      dates: '7 и 27 октября',
      price: 'от 1500₽',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
      description: 'Спектакль с Константином Хабенским о жизни обычного дома',
      link: 'https://mxat.ru'
    },
    {
      id: '4',
      title: 'Старший сын',
      venue: 'Театр им. Маяковского',
      category: 'theatre',
      dates: '11 и 12 октября',
      price: 'от 1200₽',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80',
      description: 'Классическая пьеса Александра Вампилова',
      link: 'https://www.mayakovsky.ru'
    },
    {
      id: '5',
      title: 'Илья Машков. Авангард. Китч. Классика',
      venue: 'Третьяковская галерея',
      category: 'exhibition',
      dates: 'До 26 октября',
      price: 'от 500₽',
      image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&q=80',
      description: 'Ретроспектива творчества художника «Бубнового валета»',
      link: 'https://www.tretyakovgallery.ru'
    },
    {
      id: '6',
      title: 'Экскурсия по историческому центру',
      venue: 'Красная площадь, Кремль',
      category: 'tour',
      dates: 'Ежедневно',
      price: 'от 800₽',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&q=80',
      description: 'Пешая прогулка с гидом по главным достопримечательностям',
      link: 'https://experience.tripster.ru'
    }
  ];

  const categories = [
    { id: 'all', label: 'Всё', icon: 'Sparkles' },
    { id: 'theatre', label: 'Театры', icon: 'Theater' },
    { id: 'exhibition', label: 'Выставки', icon: 'Palette' },
    { id: 'tour', label: 'Экскурсии', icon: 'Map' }
  ];

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theatre': return 'from-purple-500 to-pink-500';
      case 'exhibition': return 'from-blue-500 to-cyan-500';
      case 'tour': return 'from-green-500 to-emerald-500';
      default: return 'from-gold-500 to-gold-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'theatre': return 'Театр';
      case 'exhibition': return 'Выставка';
      case 'tour': return 'Экскурсия';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-br from-warm-50 to-white">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
          <Icon name="Ticket" size={20} />
          <span className="font-playfair font-bold">Культурная афиша</span>
        </div>
        <h2 className="text-4xl font-playfair font-bold text-charcoal-900 mb-4">
          Досуг в Москве • Октябрь 2025
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Поможем приобрести билеты на лучшие мероприятия города: театры, выставки и экскурсии
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <Icon name={cat.icon as any} size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <div className={`bg-gradient-to-r ${getCategoryColor(activity.category)} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                  {getCategoryLabel(activity.category)}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-playfair font-bold text-charcoal-900 mb-2 line-clamp-2">
                {activity.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                <Icon name="MapPin" size={16} />
                <span className="line-clamp-1">{activity.venue}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                <Icon name="Calendar" size={16} />
                <span>{activity.dates}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {activity.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-2xl font-bold text-charcoal-900">
                  {activity.price}
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all group">
                  Заказать
                  <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Headphones" size={40} className="text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-2">
              Как заказать билеты?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Свяжитесь с нами по WhatsApp или телефону, и мы поможем выбрать и приобрести билеты 
              на любые мероприятия. Доставим электронные билеты прямо в день заезда!
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href="https://wa.me/79001234567"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <Icon name="MessageCircle" size={18} />
                WhatsApp
              </a>
              <a
                href="tel:+79001234567"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                <Icon name="Phone" size={18} />
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalActivitiesSection;
