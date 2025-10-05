import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import TicketOrderModal from '@/components/modals/TicketOrderModal';

interface Activity {
  id: string;
  title: string;
  venue: string;
  category: 'theatre' | 'exhibition' | 'tour';
  dates: string;
  price: string;
  image: string;
  description: string;
  categoryLabel: string;
}

const CulturalSliderSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Карл Брюллов. Рим – Москва – Петербург',
      venue: 'Новая Третьяковка',
      category: 'exhibition',
      categoryLabel: 'Выставка',
      dates: 'До 18 января 2026',
      price: 'от 500₽',
      image: 'https://images.unsplash.com/photo-1577720643272-265f7618c4d8?w=1200&q=80',
      description: 'Масштабная выставка работ великого русского художника. Более 200 произведений из лучших музеев России'
    },
    {
      id: '3',
      title: 'Жил. Был. Дом.',
      venue: 'МХТ им. Чехова',
      category: 'theatre',
      categoryLabel: 'Театр',
      dates: '7 и 27 октября',
      price: 'от 1500₽',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80',
      description: 'Спектакль с Константином Хабенским о жизни обычного дома и его обитателей'
    },
    {
      id: '4',
      title: 'Старший сын',
      venue: 'Театр им. Маяковского',
      category: 'theatre',
      categoryLabel: 'Театр',
      dates: '11 и 12 октября',
      price: 'от 1200₽',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1200&q=80',
      description: 'Классическая пьеса Александра Вампилова в современной постановке'
    },
    {
      id: '6',
      title: 'Экскурсия по историческому центру',
      venue: 'Красная площадь, Кремль',
      category: 'tour',
      categoryLabel: 'Экскурсия',
      dates: 'Ежедневно',
      price: 'от 800₽',
      image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1200&q=80',
      description: 'Пешая прогулка с гидом по главным достопримечательностям столицы'
    },
    {
      id: '2',
      title: 'Александр Дейнека. Гимн жизни',
      venue: 'Третьяковская галерея',
      category: 'exhibition',
      categoryLabel: 'Выставка',
      dates: 'До 26 октября',
      price: 'от 500₽',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80',
      description: 'Произведения одного из ключевых мастеров советского искусства XX века'
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, activities.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activities.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activities.length) % activities.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theatre': return 'from-purple-500 to-pink-500';
      case 'exhibition': return 'from-blue-500 to-cyan-500';
      case 'tour': return 'from-green-500 to-emerald-500';
      default: return 'from-gold-500 to-gold-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
          <Icon name="Sparkles" size={20} />
          <span className="font-playfair font-bold">Культурная программа</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal-900 mb-3">
          Октябрьский досуг в Москве
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          для гостей апартаментов
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-charcoal-900">
        <div className="relative h-[500px] md:h-[600px]">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <div className="max-w-3xl">
                  <div className="mb-4">
                    <span className={`inline-block bg-gradient-to-r ${getCategoryColor(activity.category)} text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg`}>
                      {activity.categoryLabel}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4 leading-tight">
                    {activity.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={20} />
                      <span className="text-lg">{activity.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={20} />
                      <span className="text-lg">{activity.dates}</span>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-4xl font-bold text-white">
                      {activity.price}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all group"
                    >
                      Заказать билеты
                      <Icon name="Ticket" size={22} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all group z-10"
          aria-label="Предыдущий слайд"
        >
          <Icon name="ChevronLeft" size={28} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all group z-10"
          aria-label="Следующий слайд"
        >
          <Icon name="ChevronRight" size={28} className="text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          {activities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/70'
              } rounded-full`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all z-10"
          aria-label={isAutoPlay ? 'Остановить автопрокрутку' : 'Запустить автопрокрутку'}
        >
          <Icon name={isAutoPlay ? 'Pause' : 'Play'} size={20} className="text-white" />
        </button>
      </div>

      <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Icon name="Info" size={32} className="text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-charcoal-900 mb-2">
              Поможем с выбором и покупкой билетов
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Наш консьерж-сервис поможет подобрать мероприятия по вашим интересам, 
              приобрести билеты и доставить их прямо в апартаменты. <br />
              Просто нажмите "Заказать билеты"!
            </p>
          </div>
        </div>
      </div>

      {selectedActivity && (
        <TicketOrderModal
          activity={selectedActivity}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default CulturalSliderSection;