import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';

const GoogleBusiness = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: 'Home',
      title: 'Премиум апартаменты',
      description: 'Элитные апартаменты на Поклонной 9 с европейским ремонтом и всеми удобствами'
    },
    {
      icon: 'Calendar',
      title: 'Посуточная аренда',
      description: 'Аренда квартир посуточно в Москве на ул. Поклонная 9 от 1 дня'
    },
    {
      icon: 'Star',
      title: '5 звёзд сервис',
      description: 'Люкс апартаменты в 5* комплексе с круглосуточной поддержкой'
    },
    {
      icon: 'Wifi',
      title: 'Все удобства',
      description: 'Wi-Fi, кухня, бытовая техника, постельное бельё, полотенца'
    },
    {
      icon: 'MapPin',
      title: 'Отличное расположение',
      description: 'Рядом с Парком Победы, метро Парк Победы (7 мин), Крокус фитнес'
    },
    {
      icon: 'Car',
      title: 'Парковка',
      description: 'Бесплатная парковка для гостей в охраняемом комплексе'
    }
  ];

  const amenities = [
    'Wi-Fi высокоскоростной',
    'Кондиционер',
    'Кухня с техникой',
    'Стиральная машина',
    'ТВ с Smart TV',
    'Постельное бельё',
    'Полотенца',
    'Посуда и столовые приборы',
    'Утюг и гладильная доска',
    'Фен',
    'Чай и кофе',
    'Средства гигиены'
  ];

  const nearbyAttractions = [
    { name: 'Парк Победы', distance: '5 минут пешком', icon: 'TreePine' },
    { name: 'Метро Парк Победы', distance: '7 минут пешком', icon: 'Train' },
    { name: 'Крокус фитнес', distance: 'В комплексе', icon: 'Dumbbell' },
    { name: 'Поклонная гора', distance: '5 минут пешком', icon: 'Mountain' },
    { name: 'Музей ВОВ', distance: '10 минут пешком', icon: 'Landmark' },
    { name: 'Триумфальная арка', distance: '8 минут пешком', icon: 'Building' }
  ];

  return (
    <div className="min-h-screen bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12" itemScope itemType="https://schema.org/LocalBusiness">
        
        <meta itemProp="name" content="ENZO Отель - Поклонная 9" />
        <meta itemProp="description" content="Премиум апартаменты на короткий срок на Поклонной 9 в Москве. Посуточная аренда элитных апартаментов 5 звезд." />
        <meta itemProp="telephone" content="+79141965172" />
        <meta itemProp="priceRange" content="₽₽₽" />
        
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" style={{ display: 'none' }}>
          <meta itemProp="streetAddress" content="ул. Поклонная, д. 9" />
          <meta itemProp="addressLocality" content="Москва" />
          <meta itemProp="addressRegion" content="Москва" />
          <meta itemProp="postalCode" content="121170" />
          <meta itemProp="addressCountry" content="RU" />
        </div>
        
        <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates" style={{ display: 'none' }}>
          <meta itemProp="latitude" content="55.731876" />
          <meta itemProp="longitude" content="37.498388" />
        </div>

        <header className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-5xl font-playfair font-bold text-charcoal-900">P9</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-300 rounded-full opacity-80"></div>
            </div>
          </div>
          
          <h1 className="text-5xl font-playfair text-gold-400 mb-4">
            ENZO Отель - Премиум Апартаменты
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            на Поклонной 9, Москва
          </p>
          <p className="text-xl text-gray-400 mb-6">
            Элитные апартаменты 5★ для посуточной аренды
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-charcoal-800 px-4 py-2 rounded-lg">
              <Icon name="Star" className="text-gold-400 fill-gold-400" size={20} />
              <span className="text-gold-400 font-semibold">5.0 из 5</span>
              <span className="text-gray-400">(7 отзывов)</span>
            </div>
            
            <div className="flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-lg">
              <Icon name="Clock" className="text-green-400" size={20} />
              <span className="text-green-400 font-semibold">Открыто круглосуточно</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+79141965172">
              <FizzyButton
                size="lg"
                icon={<Icon name="Phone" size={20} />}
              >
                Позвонить: +7 (914) 196-51-72
              </FizzyButton>
            </a>
            <a href="https://wa.me/79361414232?text=Добро%20пожаловать%20в%20роскошные%20премиум%20апартаменты%20в%205*%20комплексе%20Поклонная%209,%20где%20проживание%20Вам%20точно%20понравится!" target="_blank" rel="noopener noreferrer">
              <FizzyButton
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                icon={<Icon name="MessageCircle" size={20} />}
              >
                WhatsApp
              </FizzyButton>
            </a>
            <FizzyButton
              onClick={() => navigate('/bookings')}
              size="lg"
              icon={<Icon name="Calendar" size={20} />}
            >
              Забронировать
            </FizzyButton>
          </div>
        </header>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Icon name="MapPin" className="text-gold-400 flex-shrink-0 mt-1" size={32} />
            <div>
              <h2 className="text-2xl font-playfair text-gold-400 mb-2">Адрес и контакты</h2>
              <p className="text-xl text-white mb-2">г. Москва, ул. Поклонная, д. 9</p>
              <p className="text-gray-300 mb-4">
                Премиум апартаменты в 5* комплексе Поклонная 9 рядом с Парком Победы
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="text-gold-400" size={20} />
                  <a href="tel:+79141965172" className="text-gold-400 hover:text-gold-300 transition-colors">
                    +7 (914) 196-51-72
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MessageCircle" className="text-green-400" size={20} />
                  <a 
                    href="https://wa.me/79361414232" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    +7 (936) 141-42-32 WhatsApp
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" className="text-gold-400" size={20} />
                  <span className="text-white">Работаем круглосуточно 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Globe" className="text-gold-400" size={20} />
                  <button 
                    onClick={() => navigate('/location')}
                    className="text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    Подробнее о локации
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6 flex items-center gap-3">
            <Icon name="Briefcase" size={32} />
            Наши услуги
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-charcoal-700 p-6 rounded-lg hover:bg-charcoal-600 transition-colors">
                <Icon name={service.icon as any} className="text-gold-400 mb-3" size={32} />
                <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-300 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6 flex items-center gap-3">
            <Icon name="CheckCircle" size={32} />
            Удобства в апартаментах
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <Icon name="Check" className="text-green-400 flex-shrink-0" size={20} />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6 flex items-center gap-3">
            <Icon name="MapPin" size={32} />
            Что рядом с Поклонной 9
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyAttractions.map((place, index) => (
              <div key={index} className="bg-charcoal-700 p-5 rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name={place.icon as any} className="text-gold-400 mt-1" size={24} />
                  <div>
                    <h3 className="text-white font-semibold mb-1">{place.name}</h3>
                    <p className="text-gray-400 text-sm">{place.distance}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6 flex items-center gap-3">
            <Icon name="Clock" size={32} />
            Часы работы
          </h2>
          <div className="bg-charcoal-700 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-white font-semibold">Понедельник</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-white font-semibold">Вторник</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-white font-semibold">Среда</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white font-semibold">Четверг</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-white font-semibold">Пятница</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600">
                  <span className="text-white font-semibold">Суббота</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white font-semibold">Воскресенье</span>
                  <span className="text-green-400">Круглосуточно</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
              <p className="text-green-400 font-semibold text-lg">
                Бронирование и заселение доступны 24 часа в сутки, 7 дней в неделю
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-xl p-8 border border-gold-500/30 text-center mb-8">
          <h2 className="text-3xl font-playfair text-gold-400 mb-4">
            Забронируйте апартаменты на Поклонной 9
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Снять премиум квартиру посуточно в ENZO отеле — это элитные апартаменты в 5* комплексе 
            на ул. Поклонная 9 в Москве. Посуточная аренда апартаментов на короткий срок рядом с Парком Победы 
            и метро Парк Победы. Круглосуточное бронирование и заселение.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <FizzyButton
              onClick={() => navigate('/location')}
              size="lg"
              icon={<Icon name="MapPin" size={20} />}
            >
              О локации
            </FizzyButton>
            <FizzyButton
              onClick={() => navigate('/reviews')}
              size="lg"
              icon={<Icon name="Star" size={20} />}
            >
              Отзывы гостей
            </FizzyButton>
            <FizzyButton
              onClick={() => navigate('/bookings')}
              size="lg"
              icon={<Icon name="Calendar" size={20} />}
            >
              Забронировать онлайн
            </FizzyButton>
          </div>
          <p className="text-2xl text-gold-400 font-semibold">
            г. Москва, ул. Поклонная, д. 9 | ENZO Отель | 24/7
          </p>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-playfair text-gold-400 mb-4 text-center">
            Ключевые запросы для поиска
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              'Поклонная 9 аренда',
              'снять квартиру Поклонная 9',
              'апартаменты посуточно Москва',
              'премиум апартаменты Поклонная',
              'элитные апартаменты Москва',
              '5 звезд Поклонная 9',
              'гостиница Парк Победы',
              'отель у Парка Победы',
              'жильё метро Парк Победы',
              'ENZO отель Москва',
              'люкс апартаменты',
              'краткосрочная аренда'
            ].map((keyword, index) => (
              <span 
                key={index} 
                className="bg-charcoal-700 text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoogleBusiness;
