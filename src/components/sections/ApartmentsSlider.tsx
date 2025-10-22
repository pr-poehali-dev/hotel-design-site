import { useState, useEffect } from 'react';
import { rooms } from '@/data/roomsData';
import Icon from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';

interface ApartmentsSliderProps {
  onNavigate: (section: string) => void;
}

const ApartmentsSlider = ({ onNavigate }: ApartmentsSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);

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
    setGalleryImageIndex(0);
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
                  <div className="relative group">
                    <div 
                      className="relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
                      onClick={() => {
                        if (room.gallery && room.gallery.length > 0) {
                          setGalleryOpen(true);
                          setGalleryImageIndex(0);
                        }
                      }}
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      
                      {room.gallery && room.gallery.length > 0 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Icon name="Maximize2" size={20} />
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <h3 className="text-3xl font-playfair font-bold mb-3 group-hover:text-gold-400 transition-colors duration-300">
                          {room.name}
                        </h3>
                        <p className="text-2xl font-bold text-gold-400 mb-4">{room.price}</p>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {room.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-white/20"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('rooms');
                          }}
                          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
                        >
                          <Icon name="Info" size={18} />
                          Подробнее
                        </button>
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
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-charcoal-900 font-bold px-10 py-5 rounded-full transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-gold-500/60 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Icon name="Home" size={24} className="relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10 text-lg">Смотреть все апартаменты</span>
            <Icon name="ArrowRight" size={24} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            <span className="absolute -right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-gold-300/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></span>
          </button>
        </div>
      </div>

      <Sheet open={galleryOpen} onOpenChange={setGalleryOpen}>
        <SheetContent side="bottom" className="h-screen p-0">
          <div className="relative w-full h-full bg-black flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={rooms[currentIndex]?.gallery?.[galleryImageIndex] || rooms[currentIndex]?.image}
                alt={rooms[currentIndex]?.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            {rooms[currentIndex]?.gallery && rooms[currentIndex].gallery!.length > 1 && (
              <>
                <button
                  onClick={() => setGalleryImageIndex((prev) => 
                    (prev - 1 + rooms[currentIndex].gallery!.length) % rooms[currentIndex].gallery!.length
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full p-4 transition-all z-10"
                >
                  <Icon name="ChevronLeft" size={32} />
                </button>
                <button
                  onClick={() => setGalleryImageIndex((prev) => 
                    (prev + 1) % rooms[currentIndex].gallery!.length
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full p-4 transition-all z-10"
                >
                  <Icon name="ChevronRight" size={32} />
                </button>

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {rooms[currentIndex].gallery?.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryImageIndex(i)}
                      className={`transition-all rounded-full ${
                        i === galleryImageIndex
                          ? 'bg-gold-400 w-8 h-3'
                          : 'bg-white/50 hover:bg-white/70 w-3 h-3'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <div className="bg-black/60 backdrop-blur-sm text-white rounded-xl px-4 py-3">
                <h3 className="font-playfair font-bold text-lg">{rooms[currentIndex]?.name}</h3>
                <p className="text-gold-400 text-sm">
                  {galleryImageIndex + 1} / {rooms[currentIndex]?.gallery?.length || 1}
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default ApartmentsSlider;