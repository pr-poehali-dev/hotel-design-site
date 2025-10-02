import { useCallback, useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Icon from '@/components/ui/icon';

const VideoSliderSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const slides = [
    {
      image: 'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
      title: '2х комнатный 2019',
      description: '55 кв.м роскоши на 20 этаже'
    },
    {
      image: 'https://cdn.poehali.dev/files/2202139f-75ce-4af1-8c7a-de66a7c2e431.jpeg',
      title: 'Современный интерьер',
      description: 'Техника премиум-класса'
    },
    {
      image: 'https://cdn.poehali.dev/files/ea0dc8af-de8c-41fb-9865-7379da038018.jpeg',
      title: 'Панорамные виды',
      description: 'Вид на Поклонную гору'
    },
    {
      image: 'https://cdn.poehali.dev/files/25507b39-2c9d-46be-aa9c-32d23e63323f.jpeg',
      title: 'Максимальный комфорт',
      description: 'PS5, телескоп, массажное кресло'
    },
    {
      image: 'https://cdn.poehali.dev/files/5eb93d1a-6444-4e64-95a2-ea9b0a834307.jpeg',
      title: 'Элегантная спальня',
      description: 'King-size кровать и уют'
    },
    {
      image: 'https://cdn.poehali.dev/files/0cbf887e-c8ab-412b-a372-1728ea656c15.jpeg',
      title: 'Кухня премиум',
      description: 'Кварцевые столешницы'
    },
    {
      image: 'https://cdn.poehali.dev/files/fb93407e-b72a-4593-ae8f-d92a21e17e2d.jpeg',
      title: 'Дизайнерская ванная',
      description: 'Роскошь в деталях'
    },
    {
      image: 'https://cdn.poehali.dev/files/25a0718c-903c-4139-a8de-7ecf199f8c93.jpeg',
      title: 'Гостиная зона',
      description: 'Пространство для отдыха'
    },
    {
      image: 'https://cdn.poehali.dev/files/87d169bb-157e-4520-9001-2f8b94f6a3ae.jpeg',
      title: 'Уютная атмосфера',
      description: 'Идеально для проживания'
    },
    {
      image: 'https://cdn.poehali.dev/files/76fbc7c3-2929-4fb3-85f5-103fd1973b3b.jpeg',
      title: 'Вид из окна',
      description: 'Панорама столицы'
    },
    {
      image: 'https://cdn.poehali.dev/files/a59d5960-d38b-4f76-a57c-516000294c8a.jpeg',
      title: 'Функциональность',
      description: 'Все для комфорта'
    },
    {
      image: 'https://cdn.poehali.dev/files/f6a7bb29-e74b-49b7-8609-4258aac8472d.jpeg',
      title: 'Детали интерьера',
      description: 'Премиум качество'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-charcoal-900 via-charcoal-800 to-charcoal-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.1),transparent_50%)]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-4">
            Наши <span className="text-gold-400">Апартаменты</span>
          </h2>
          <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            2х комнатный 2019 — премиум студия с максимальной комплектацией
          </p>
        </div>

        <div className="relative perspective-1000">
          <div className="overflow-visible py-12" ref={emblaRef}>
            <div className="flex items-center">
              {slides.map((slide, index) => {
                const offset = index - selectedIndex;
                const isActive = index === selectedIndex;
                
                return (
                  <div 
                    key={index} 
                    className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_40%] px-4 transition-all duration-700"
                    style={{
                      transform: `
                        translateX(${offset * 10}%) 
                        scale(${isActive ? 1 : 0.85}) 
                        rotateY(${offset * -15}deg)
                      `,
                      opacity: isActive ? 1 : 0.5,
                      zIndex: isActive ? 10 : 1,
                    }}
                  >
                    <div className="relative group overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] bg-gradient-to-br from-charcoal-800 to-charcoal-900 border border-gold-500/20 transform-gpu transition-all duration-700 hover:shadow-[0_30px_80px_rgba(218,165,32,0.3)]">
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent opacity-60"></div>
                      </div>
                      
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/95 via-charcoal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-playfair font-bold text-gold-400 text-3xl mb-3 drop-shadow-lg">
                            {slide.title}
                          </h3>
                          <p className="font-inter text-gray-200 text-base leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {slide.description}
                          </p>
                        </div>
                      </div>

                      <div className="absolute top-6 right-6 w-16 h-16 border-2 border-gold-400/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-180">
                        <Icon name="Sparkles" size={24} className="text-gold-400" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-900 rounded-full p-5 transition-all duration-300 hover:scale-110 shadow-[0_10px_30px_rgba(218,165,32,0.4)] hover:shadow-[0_15px_40px_rgba(218,165,32,0.6)]"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeft" size={32} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-900 rounded-full p-5 transition-all duration-300 hover:scale-110 shadow-[0_10px_30px_rgba(218,165,32,0.4)] hover:shadow-[0_15px_40px_rgba(218,165,32,0.6)]"
            aria-label="Next slide"
          >
            <Icon name="ChevronRight" size={32} />
          </button>

          <div className="flex justify-center gap-3 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? 'bg-gold-400 w-12 h-3 shadow-[0_0_15px_rgba(218,165,32,0.6)]'
                    : 'bg-white/30 hover:bg-white/50 w-3 h-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSliderSection;