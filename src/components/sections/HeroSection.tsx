import { useState, useEffect } from 'react';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);

  const slides = [
    {
      image: 'https://cdn.poehali.dev/files/5df8e629-1f9d-47b4-9f53-139fb374bf0d.png',
      title: 'Премиум студия',
      subtitle: 'От 55 до 150 кв.м роскоши на Поклонной'
    },
    {
      image: 'https://cdn.poehali.dev/files/0e0aad4f-4840-442c-bf90-561499ee3c16.jpeg',
      title: 'Панорамные виды',
      subtitle: 'Виды на город и Поклонную гору'
    },
    {
      image: 'https://cdn.poehali.dev/files/ef1cdf6d-1ae1-4f13-a118-c82e9a55c278.jpeg',
      title: 'Элитный комплекс',
      subtitle: 'Поклонная 9 - архитектурный шедевр'
    },
    {
      image: 'https://cdn.poehali.dev/files/507edb80-c558-4558-adf5-46732b17631e.jpg',
      title: 'Современная архитектура',
      subtitle: 'Элегантность и стиль'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true'
        );
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const weatherCode = data.current_weather.weathercode;
        
        let condition = 'sun';
        if (weatherCode >= 61 && weatherCode <= 67) {
          condition = 'rain';
        } else if (weatherCode >= 2 && weatherCode <= 3) {
          condition = 'cloud';
        } else if (weatherCode >= 71 && weatherCode <= 77) {
          condition = 'snow';
        }
        
        setWeather({ temp, condition });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-screen bg-gradient-to-r from-charcoal-900 to-charcoal-800 flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-40 scale-100' : 'opacity-0 scale-110'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        ></div>
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-charcoal-900/40"></div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-4 text-base md:text-xl font-inter text-gold-300 animate-fade-in">
          <span className="uppercase tracking-wider">Зима близко - А у нас уютно и тепло</span>
          {weather && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="font-semibold">{weather.temp}°C</span>
              {weather.condition === 'sun' && <Icon name="Sun" size={20} className="text-yellow-400" />}
              {weather.condition === 'cloud' && <Icon name="Cloud" size={20} className="text-gray-300" />}
              {weather.condition === 'rain' && <Icon name="CloudRain" size={20} className="text-blue-300" />}
              {weather.condition === 'snow' && <Icon name="Snowflake" size={20} className="text-blue-200" />}
            </div>
          )}
        </div>
        <h2 className="text-4xl md:text-8xl font-playfair font-bold mb-6 animate-fade-in">
          Роскошь и <span className="text-gold-400">Элегантность</span>
        </h2>
        <p className="text-base md:text-2xl font-inter mb-4 text-gray-200 animate-fade-in-slow">
          Видовые апартаменты 5* комплекса Поклонная 9
        </p>
        <p className="text-sm md:text-xl font-inter mb-8 text-gold-300 animate-fade-in-slow font-semibold">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <FizzyButton
            onClick={() => onNavigate('rooms')}
            icon={<Icon name="Calendar" size={20} />}
          >
            Забронировать апартаменты
          </FizzyButton>
          <FizzyButton
            onClick={() => onNavigate('rooms')}
            variant="secondary"
            icon={<Icon name="Bed" size={20} />}
          >
            Наши апартаменты
          </FizzyButton>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-gold-400 w-12 h-3'
                : 'bg-white/40 hover:bg-white/60 w-3 h-3'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-charcoal-900/60 backdrop-blur-sm py-8 overflow-hidden">
        <div className="animate-scroll-left whitespace-nowrap">
          <span className="inline-flex items-center gap-8 text-white font-inter text-lg">
            <span className="flex items-center gap-2">
              <Icon name="Eye" size={20} className="text-gold-400" />
              ВИДОВЫЕ АПАРТАМЕНТЫ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="UtensilsCrossed" size={20} className="text-gold-400" />
              ПОЛНОЦЕННЫЕ КУХНИ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Gamepad2" size={20} className="text-gold-400" />
              ИГРОВЫЕ КОНСОЛИ PS5
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Dumbbell" size={20} className="text-gold-400" />
              ФИТНЕС
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Sparkles" size={20} className="text-gold-400" />
              СПА
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="CarFront" size={20} className="text-gold-400" />
              ПОДЗЕМНЫЙ ПАРКИНГ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="UserCheck" size={20} className="text-gold-400" />
              ЛИЧНЫЙ АДМИНИСТРАТОР
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="BellRing" size={20} className="text-gold-400" />
              БЭЛЛМАН
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Package" size={20} className="text-gold-400" />
              КАМЕРА ХРАНЕНИЯ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Shirt" size={20} className="text-gold-400" />
              ПРАЧЕЧНАЯ/ХИМЧИСТКА/ГЛАЖКА/СТИРКА
            </span>
            <span className="text-gold-400 mx-8">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Eye" size={20} className="text-gold-400" />
              ВИДОВЫЕ АПАРТАМЕНТЫ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="UtensilsCrossed" size={20} className="text-gold-400" />
              ПОЛНОЦЕННЫЕ КУХНИ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Gamepad2" size={20} className="text-gold-400" />
              ИГРОВЫЕ КОНСОЛИ PS5
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Dumbbell" size={20} className="text-gold-400" />
              ФИТНЕС
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Sparkles" size={20} className="text-gold-400" />
              СПА
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="CarFront" size={20} className="text-gold-400" />
              ПОДЗЕМНЫЙ ПАРКИНГ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="UserCheck" size={20} className="text-gold-400" />
              ЛИЧНЫЙ АДМИНИСТРАТОР
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="BellRing" size={20} className="text-gold-400" />
              БЭЛЛМАН
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Package" size={20} className="text-gold-400" />
              КАМЕРА ХРАНЕНИЯ
            </span>
            <span className="text-gold-400">•</span>
            <span className="flex items-center gap-2">
              <Icon name="Shirt" size={20} className="text-gold-400" />
              ПРАЧЕЧНАЯ/ХИМЧИСТКА/ГЛАЖКА/СТИРКА
            </span>
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;