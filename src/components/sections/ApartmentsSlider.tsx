import { useState, useEffect } from 'react';
import { rooms } from '@/data/roomsData';
import Icon from '@/components/ui/icon';

interface ApartmentsSliderProps {
  onNavigate: (section: string) => void;
}

const ApartmentsSlider = ({ onNavigate }: ApartmentsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rooms.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % rooms.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-charcoal-900 to-charcoal-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
            Наши <span className="text-gold-400">Апартаменты</span>
          </h2>
          <p className="text-gray-300 text-lg">Выберите идеальное место для вашего отдыха</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gold-500/20 hover:bg-gold-500/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hover:scale-110 -translate-x-4"
          >
            <Icon name="ChevronLeft" size={28} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gold-500/20 hover:bg-gold-500/40 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 hover:scale-110 translate-x-4"
          >
            <Icon name="ChevronRight" size={28} />
          </button>

          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {rooms.map((room, index) => (
                <div
                  key={index}
                  className="min-w-full px-4"
                >
                  <div 
                    className="relative group cursor-pointer"
                    onClick={() => onNavigate('rooms')}
                  >
                    <div className="relative h-[500px] rounded-2xl overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-playfair font-bold mb-3 group-hover:text-gold-400 transition-colors duration-300">
                          {room.name}
                        </h3>
                        <p className="text-2xl font-bold text-gold-400 mb-4">{room.price}</p>
                        <div className="flex flex-wrap gap-3">
                          {room.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-gold-400 w-12 h-3'
                    : 'bg-white/30 hover:bg-white/50 w-3 h-3'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('rooms')}
            className="group inline-flex items-center gap-3 bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold-500/50"
          >
            <span>Смотреть все апартаменты</span>
            <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ApartmentsSlider;
