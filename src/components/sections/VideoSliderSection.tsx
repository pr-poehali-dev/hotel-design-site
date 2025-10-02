import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Icon from '@/components/ui/icon';

const VideoSliderSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const slides = [
    {
      image: 'https://cdn.poehali.dev/files/5df8e629-1f9d-47b4-9f53-139fb374bf0d.png',
      title: 'Фасад комплекса',
      description: 'Архитектурная элегантность Поклонной 9'
    },
    {
      image: 'https://cdn.poehali.dev/files/0e0aad4f-4840-442c-bf90-561499ee3c16.jpeg',
      title: 'Панорамный вид',
      description: 'Незабываемые виды на столицу'
    },
    {
      image: 'https://cdn.poehali.dev/files/ef1cdf6d-1ae1-4f13-a118-c82e9a55c278.jpeg',
      title: 'Вечерняя иллюминация',
      description: 'Элитный жилой комплекс премиум-класса'
    },
    {
      image: 'https://cdn.poehali.dev/files/507edb80-c558-4558-adf5-46732b17631e.jpg',
      title: 'Современный дизайн',
      description: 'Золотые акценты и стильная архитектура'
    },
    {
      image: 'https://cdn.poehali.dev/files/ccdc571a-4af9-4618-87fb-7900b09688ad.jpeg',
      title: 'Интерьеры',
      description: 'Роскошь в каждой детали'
    }
  ];

  return (
    <section className="py-20 bg-charcoal-900 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-playfair font-bold text-white mb-4">
            Фото <span className="text-gold-400">Галерея</span>
          </h2>
          <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Откройте для себя красоту и роскошь комплекса Поклонная 9
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                  <div className="relative group overflow-hidden rounded-2xl shadow-2xl bg-charcoal-800">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-playfair font-bold text-gold-400 text-2xl mb-2">
                        {slide.title}
                      </h3>
                      <p className="font-inter text-gray-200 text-sm">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-gold-500/90 hover:bg-gold-600 text-charcoal-900 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeft" size={28} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-gold-500/90 hover:bg-gold-600 text-charcoal-900 rounded-full p-4 transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Next slide"
          >
            <Icon name="ChevronRight" size={28} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSliderSection;
