import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Room {
  name: string;
  subtitle?: string;
  price: string;
  features: string[];
  image: string;
  gallery?: string[];
  video?: string;
  description?: string;
  bookingUrl?: string;
}

interface RoomCardProps {
  room: Room;
  currentImageIndex: number;
  onImageChange: (delta: number, galleryLength: number) => void;
  onHoverChange: (isHovering: boolean) => void;
}

const RoomCard = ({ room, currentImageIndex, onImageChange, onHoverChange }: RoomCardProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Card 
      className="overflow-hidden shadow-2xl border-0 bg-white hover:shadow-3xl transition-all duration-300 group"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
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
                    onImageChange(-1, room.gallery!.length);
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all z-10"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(1, room.gallery!.length);
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
          {room.subtitle && <p className="text-gray-200 text-lg font-inter">{room.subtitle}</p>}
          <p className="text-gold-400 text-xl font-semibold mt-1">{room.price}/ночь</p>
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
        
        {room.description && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-6 border-gold-500 text-gold-600 hover:bg-gold-50 font-semibold">
                <Icon name="FileText" size={18} className="mr-2" />
                Подробнее
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-playfair text-charcoal-900">{room.name}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <div className="prose prose-charcoal max-w-none">
                  <p className="whitespace-pre-wrap text-charcoal-700 leading-relaxed">{room.description}</p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
        
        <Button 
          className="w-full mt-4 bg-gold-500 hover:bg-gold-600 text-charcoal-900 font-semibold"
          onClick={() => room.bookingUrl && window.open(room.bookingUrl, '_blank')}
        >
          Забронировать
        </Button>
      </div>
    </Card>
  );
};

export default RoomCard;