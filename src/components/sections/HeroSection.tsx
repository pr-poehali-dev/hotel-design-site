import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
      title: 'Премиум студия',
      subtitle: '55 кв.м роскоши на 20 этаже'
    },
    {
      image: 'https://cdn.poehali.dev/files/2202139f-75ce-4af1-8c7a-de66a7c2e431.jpeg',
      title: 'Современный дизайн',
      subtitle: 'Техника премиум-класса и массажное кресло'
    },
    {
      image: 'https://cdn.poehali.dev/files/ea0dc8af-de8c-41fb-9865-7379da038018.jpeg',
      title: 'Панорамные виды',
      subtitle: 'Элитный комплекс Поклонная 9'
    },
    {
      image: 'https://cdn.poehali.dev/files/25507b39-2c9d-46be-aa9c-32d23e63323f.jpeg',
      title: 'Максимальный комфорт',
      subtitle: 'PS5, телескоп и 5★ обслуживание'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

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
      
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
      >
        <Icon name="ChevronLeft" size={32} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
      >
        <Icon name="ChevronRight" size={32} />
      </button>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h2 className="text-6xl md:text-8xl font-playfair font-bold mb-6 animate-fade-in">
          Роскошь и <span className="text-gold-400">Элегантность</span>
        </h2>
        <p className="md:text-2xl font-inter mb-4 text-gray-200 animate-fade-in-slow text-lg">
          Видовые апартаменты 5* комплекса Поклонная 9
        </p>
        <p className="md:text-xl font-inter mb-8 text-gold-300 animate-fade-in-slow text-base font-semibold">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button
            onClick={() => window.open('https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&utm_source=share_from_pms&scroll_to_rooms=1&token=07f1a&is_auto_search=0&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=0&insidePopup=0&dfrom=29-12-2025&dto=31-12-2025&adults=1', '_blank')}
            className="bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold px-8 py-4 text-lg"
          >
            Забронировать апартаменты
          </Button>
          <Button
            onClick={() => onNavigate('rooms')}
            variant="outline"
            className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-charcoal-900 font-semibold px-8 py-4 text-lg"
          >
            Наши апартаменты
          </Button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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
    </section>
  );
};

export default HeroSection;