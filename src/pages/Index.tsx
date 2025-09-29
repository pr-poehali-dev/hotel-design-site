import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Номера', icon: 'Bed' },
    { id: 'booking', label: 'Бронирование', icon: 'Calendar' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  const hotelImages = [
    { url: 'https://cdn.poehali.dev/files/c967fccf-7cf2-4c56-82ea-8e57d812d0f1.jpeg', title: 'Вид на Поклонную гору' },
    { url: 'https://cdn.poehali.dev/files/d4a44fee-7b1f-466f-b16d-6e7d66cc4b06.jpeg', title: 'Лобби Поклонная 9' },
    { url: 'https://cdn.poehali.dev/files/5c65ea91-ed82-4428-94f5-6b6085637be2.jpeg', title: 'Интерьер апартаментов' },
  ];

  const rooms = [
    {
      name: 'Студия',
      price: '6 500 ₽',
      features: ['Двуспальная кровать', 'Кондиционер', 'Wi-Fi', 'Кухня'],
      image: 'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
      gallery: [
        'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
        'https://cdn.poehali.dev/files/2202139f-75ce-4af1-8c7a-de66a7c2e431.jpeg',
        'https://cdn.poehali.dev/files/ea0dc8af-de8c-41fb-9865-7379da038018.jpeg',
        'https://cdn.poehali.dev/files/25507b39-2c9d-46be-aa9c-32d23e63323f.jpeg',
        'https://cdn.poehali.dev/files/5eb93d1a-6444-4e64-95a2-ea9b0a834307.jpeg',
        'https://cdn.poehali.dev/files/0cbf887e-c8ab-412b-a372-1728ea656c15.jpeg',
        'https://cdn.poehali.dev/files/fb93407e-b72a-4593-ae8f-d92a21e17e2d.jpeg',
        'https://cdn.poehali.dev/files/25a0718c-903c-4139-a8de-7ecf199f8c93.jpeg'
      ],
      video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      name: 'Стандартные апартаменты',
      price: '8 500 ₽',
      features: ['Двуспальная кровать', 'Кондиционер', 'Wi-Fi', 'Мини-бар'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Делюкс с видом',
      price: '12 000 ₽',
      features: ['Панорамные окна', 'Рабочая зона', 'Умный дом', 'Халаты и тапочки'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Люкс апартаменты',
      price: '15 000 ₽',
      features: ['Отдельная гостиная', 'Джакузи', 'Вид на город', 'Завтрак включен'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Семейные апартаменты',
      price: '18 000 ₽',
      features: ['2 спальни', 'Кухня-студия', 'Детская зона', 'Балкон'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Бизнес-люкс',
      price: '22 000 ₽',
      features: ['Кабинет', 'Конференц-связь', 'Экспресс check-in', 'Лаундж-доступ'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Пентхаус',
      price: '28 000 ₽',
      features: ['Терраса 50м²', 'Панорама 360°', 'Сауна', 'Кухня премиум'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Президентские апартаменты',
      price: '35 000 ₽',
      features: ['Панорамный вид', 'Персональный дворецкий', 'Терраса', 'Трансфер'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Королевский люкс',
      price: '45 000 ₽',
      features: ['200м² площади', 'Винный шкаф', 'Домашний кинотеатр', 'Спа-зона'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Компактная студия',
      price: '5 500 ₽',
      features: ['Двуспальная кровать', 'Душевая кабина', 'Wi-Fi', 'Мини-кухня'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Апартаменты с камином',
      price: '19 000 ₽',
      features: ['Биокамин', 'Большая гостиная', 'Вид на парк', 'Премиум-мебель'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Романтик-сюит',
      price: '16 000 ₽',
      features: ['Круглая кровать', 'Джакузи на двоих', 'Шампанское в подарок', 'Лепестки роз'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Панорама-люкс',
      price: '24 000 ₽',
      features: ['Окна от пола до потолка', 'Вид на Москва-Сити', 'Балкон 15м²', 'Телескоп'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Дизайнерские апартаменты',
      price: '26 000 ₽',
      features: ['Авторский дизайн', 'Арт-объекты', 'Эксклюзивная мебель', 'Умное освещение'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Спорт-люкс',
      price: '20 000 ₽',
      features: ['Домашний тренажерный зал', 'Йога-зона', 'Спортивное питание', 'Массажное кресло'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Эко-апартаменты',
      price: '17 000 ₽',
      features: ['Живая стена', 'Очистители воздуха', 'Эко-материалы', 'Зимний сад'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Гранд-сюит',
      price: '52 000 ₽',
      features: ['300м² площади', 'Гардеробная комната', 'Библиотека', 'Бильярдная'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Премиум с террасой',
      price: '31 000 ₽',
      features: ['Терраса 40м²', 'Уличная мебель', 'BBQ-зона', 'Джакузи под небом'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    },
    {
      name: 'Технологичный люкс',
      price: '29 000 ₽',
      features: ['Умный дом премиум', 'VR-зона', 'Игровая консоль', 'Soundbar премиум'],
      image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal-50 to-white">
      {/* Header */}
      <header className="bg-charcoal-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-playfair font-bold text-charcoal-900">P9</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-300 rounded-full opacity-80"></div>
              </div>
              <h1 className="font-playfair font-bold text-gold-400 py-0 px-0 text-xs">Premium Apartments</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentSection === item.id
                      ? 'bg-gold-500 text-charcoal-900 font-semibold'
                      : 'hover:bg-charcoal-800 text-white'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  <span className="font-inter">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentSection === 'home' && (
        <section className="relative h-screen bg-gradient-to-r from-charcoal-900 to-charcoal-800 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(https://cdn.poehali.dev/files/e72382bc-f047-402a-98e0-e7045041f247.png)` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-charcoal-900/40"></div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <h2 className="text-6xl md:text-8xl font-playfair font-bold mb-6 animate-fade-in">
              Роскошь и <span className="text-gold-400">Элегантность</span>
            </h2>
            <p className="md:text-2xl font-inter mb-8 text-gray-200 animate-fade-in-slow text-lg">
              Видовые апартаменты 5* комплекса Поклонная 9
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <Button
                onClick={() => setCurrentSection('booking')}
                className="bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold px-8 py-4 text-lg"
              >
                Забронировать апартаменты
              </Button>
              <Button
                onClick={() => setCurrentSection('rooms')}
                variant="outline"
                className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900 font-semibold px-8 py-4 text-lg"
              >
                Наши апартаменты
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Rooms Section */}
      {currentSection === 'rooms' && (
        <section className="py-20 bg-gradient-to-b from-charcoal-50 to-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
                Наши <span className="text-gold-500">Апартаменты</span>
              </h2>
              <p className="text-xl text-charcoal-600 font-inter max-w-2xl mx-auto">
                Каждые апартаменты созданы для максимального комфорта и роскоши наших гостей
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <Card 
                  key={index} 
                  className="overflow-hidden shadow-2xl border-0 bg-white hover:shadow-3xl transition-all duration-300 group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="h-64 relative overflow-hidden">
                    {room.gallery && room.gallery.length > 0 ? (
                      <>
                        <div 
                          className="h-full bg-cover bg-center transition-all duration-500"
                          style={{ backgroundImage: `url(${room.gallery[currentImageIndex % room.gallery.length]})` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent group-hover:from-charcoal-900/70 transition-all duration-300"></div>
                        </div>
                        
                        {room.gallery.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => (prev - 1 + room.gallery!.length) % room.gallery!.length);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                            >
                              <Icon name="ChevronLeft" size={24} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => (prev + 1) % room.gallery!.length);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                            >
                              <Icon name="ChevronRight" size={24} />
                            </button>
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                              {room.gallery.map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentImageIndex % room.gallery!.length
                                      ? 'bg-gold-400 w-4'
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div 
                        className="h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${room.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent group-hover:from-charcoal-900/70 transition-all duration-300"></div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <h3 className="text-2xl font-playfair font-bold">{room.name}</h3>
                      <p className="text-gold-400 text-xl font-semibold">{room.price}/ночь</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      {room.features.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-3 text-charcoal-700">
                          <Icon name="Check" size={16} className="text-gold-500" />
                          <span className="font-inter">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {room.video && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-charcoal-800 mb-3 font-playfair">Видео номера</h4>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={room.video}
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold">
                      Забронировать
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {currentSection === 'home' && (
        <section className="py-20 bg-charcoal-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-playfair font-bold text-white mb-4">
                Фото <span className="text-gold-400">Галерея</span>
              </h2>
              <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
                Откройте для себя красоту и роскошь наших апартаментов
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {hotelImages.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl shadow-2xl">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-playfair font-bold text-gold-400 text-lg">{image.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Section */}
      {currentSection === 'booking' && (
        <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-50 to-gold-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
                  <span className="text-gold-500">Бронирование</span> Апартаментов
                </h2>
                <p className="text-xl text-charcoal-600 font-inter">
                  Забронируйте ваши идеальные апартаменты прямо сейчас
                </p>
              </div>

              <Card className="p-8 shadow-2xl border-0 bg-white">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дата заезда</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дата выезда</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Тип апартаментов</label>
                    <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                      <option>Стандартные апартаменты - 8 500 ₽</option>
                      <option>Люкс апартаменты - 15 000 ₽</option>
                      <option>Президентские апартаменты - 35 000 ₽</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Взрослые</label>
                      <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Дети</label>
                      <select className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all">
                        <option>0</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Имя</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                      placeholder="Ваше полное имя"
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
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <Button className="w-full bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-bold py-4 text-lg">
                    Забронировать апартаменты
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contacts Section */}
      {currentSection === 'contacts' && (
        <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-playfair font-bold text-white mb-4">
                Наши <span className="text-gold-400">Контакты</span>
              </h2>
              <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
                Свяжитесь с нами для бронирования или получения дополнительной информации
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <Card className="p-8 bg-white shadow-2xl border-0">
                <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6">Контактная информация</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <Icon name="MapPin" size={24} className="text-charcoal-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 font-inter">Адрес</h4>
                      <p className="text-charcoal-600">ул. Тверская, 12, Москва, 125009</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <Icon name="Phone" size={24} className="text-charcoal-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 font-inter">Телефон</h4>
                      <p className="text-charcoal-600">+7 (495) 123-45-67</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <Icon name="Mail" size={24} className="text-charcoal-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 font-inter">Email</h4>
                      <p className="text-charcoal-600">info@grandpalace.ru</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" size={24} className="text-charcoal-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal-900 font-inter">Время работы</h4>
                      <p className="text-charcoal-600">24/7</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-white shadow-2xl border-0">
                <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6">Связаться с нами</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Имя</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                      placeholder="Ваше имя"
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
                    <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Сообщение</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all resize-none"
                      placeholder="Ваше сообщение..."
                    ></textarea>
                  </div>
                  
                  <Button className="w-full bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-bold py-3">
                    Отправить сообщение
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-charcoal-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-lg font-playfair font-bold text-charcoal-900">P9</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-300 rounded-full opacity-80"></div>
                </div>
                <h3 className="text-xl font-playfair font-bold text-gold-400">Premium Apartments</h3>
              </div>
              <p className="text-gray-300 font-inter">
                Премиальные апартаменты в самом сердце Москвы. Ваш комфорт - наш приоритет.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Услуги</h4>
              <ul className="space-y-2 text-gray-300 font-inter">
                <li>Бронирование апартаментов</li>
                <li>Ресторан и бар</li>
                <li>Конференц-залы</li>
                <li>Спа и фитнес</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-playfair font-semibold text-gold-400 mb-4">Социальные сети</h4>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                  <Icon name="Facebook" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900">
                  <Icon name="Twitter" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-charcoal-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 font-inter">
              © 2024 Premium Apartments. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;