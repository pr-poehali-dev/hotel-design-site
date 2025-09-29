import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Photo {
  url: string;
  title: string;
  description?: string;
}

interface PhotoCarouselProps {
  photos: Photo[];
}

const PhotoCarousel = ({ photos }: PhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, photos.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-charcoal-50 to-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-playfair font-bold text-charcoal-900 mb-4">
            Наши <span className="text-gold-500">Апартаменты</span>
          </h2>
          <p className="text-xl text-charcoal-600 font-inter">
            Откройте для себя роскошь и комфорт
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentIndex
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-4xl font-playfair font-bold mb-2">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-lg text-gray-200 font-inter">
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal-900 rounded-full w-14 h-14 shadow-xl z-10"
          >
            <Icon name="ChevronLeft" size={28} />
          </Button>

          <Button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal-900 rounded-full w-14 h-14 shadow-xl z-10"
          >
            <Icon name="ChevronRight" size={28} />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-gold-400 w-12 h-3'
                    : 'bg-white/60 hover:bg-white/80 w-3 h-3'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {photos.slice(0, 4).map((photo, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-32 rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-4 ring-gold-400 scale-105'
                  : 'hover:scale-105 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal-900/20"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoCarousel;