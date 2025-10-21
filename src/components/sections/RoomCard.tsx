import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import BnovoBookingWidget from '@/components/BnovoBookingWidget';

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
  roomId?: string;
}

interface RoomCardProps {
  room: Room;
  currentImageIndex: number;
  onImageChange: (delta: number, galleryLength: number) => void;
  onHoverChange: (isHovering: boolean) => void;
}

const RoomCard = ({ room, currentImageIndex, onImageChange, onHoverChange }: RoomCardProps) => {
  const [open, setOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showBookingWidget, setShowBookingWidget] = useState(false);
  const navigate = useNavigate();

  const handleBooking = () => {
    if (room.roomId) {
      navigate(`/booking?room=${room.roomId}`);
    } else {
      setShowBookingWidget(true);
    }
  };
  
  return (
    <>
    <Card 
      className="overflow-hidden shadow-2xl border-0 bg-white hover:shadow-3xl transition-all duration-300 group"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className="h-64 relative overflow-hidden">
        {room.gallery && room.gallery.length > 0 ? (
          <>
            <div 
              className="h-full bg-cover bg-center transition-all duration-500 cursor-pointer"
              style={{ backgroundImage: `url(${room.gallery[currentImageIndex % room.gallery.length]})` }}
              onClick={() => setImageModalOpen(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent group-hover:from-charcoal-900/70 transition-all duration-300"></div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Icon name="Maximize2" size={20} />
              </div>
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
            className="h-full bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${room.image})` }}
            onClick={() => setImageModalOpen(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent group-hover:from-charcoal-900/70 transition-all duration-300"></div>
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Icon name="Maximize2" size={20} />
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 text-white z-10">
          <h3 className="text-lg md:text-xl font-playfair font-bold leading-tight">{room.name}</h3>
          {room.subtitle && <p className="text-gray-200 text-sm md:text-base font-inter mt-1">{room.subtitle}</p>}
          <p className="text-gold-400 text-lg md:text-xl font-semibold mt-2">{room.price}/ночь</p>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {room.features.map((feature, i) => (
            <li key={i} className="flex items-center space-x-3 text-charcoal-700">
              <Icon name="Check" size={16} className="text-gold-500" />
              <span className="font-inter text-sm md:text-base">{feature}</span>
            </li>
          ))}
        </ul>

        
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
        
        <FizzyButton 
          className="w-full mt-4"
          onClick={handleBooking}
          icon={<Icon name="Calendar" size={18} />}
        >
          Забронировать
        </FizzyButton>
      </div>

      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
          <div className="relative w-full h-[90vh] bg-black flex items-center justify-center">
            <img
              src={room.gallery ? room.gallery[currentImageIndex % (room.gallery.length)] : room.image}
              alt={room.name}
              className="w-full h-full object-contain"
            />
            
            {room.gallery && room.gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(-1, room.gallery!.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full p-4 transition-all z-10"
                >
                  <Icon name="ChevronLeft" size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(1, room.gallery!.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full p-4 transition-all z-10"
                >
                  <Icon name="ChevronRight" size={32} />
                </button>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {room.gallery?.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentImageIndex
                          ? 'bg-gold-400 w-8'
                          : 'bg-white/60'
                      }`}
                    />
                  ))}
                  {room.video && (
                    <div
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentImageIndex === (room.gallery?.length || 0)
                          ? 'bg-gold-400 w-8'
                          : 'bg-white/60'
                      }`}
                    />
                  )}
                </div>
              </>
            )}
            
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full p-3 transition-all z-10"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </Card>
    
    {showBookingWidget && (
      <BnovoBookingWidget onClose={() => setShowBookingWidget(false)} />
    )}
    </>
  );
};

export default RoomCard;