import RoomCard from './RoomCard';

interface Room {
  name: string;
  price: string;
  features: string[];
  image: string;
  gallery?: string[];
  video?: string;
}

interface RoomsSectionProps {
  rooms: Room[];
  currentImageIndex: number;
  onImageChange: (delta: number, galleryLength: number) => void;
  onHoverChange: (isHovering: boolean) => void;
}

const RoomsSection = ({ rooms, currentImageIndex, onImageChange, onHoverChange }: RoomsSectionProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-charcoal-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-charcoal-900 mb-4">
            Наши <span className="text-gold-500">Апартаменты</span>
          </h2>
          <p className="text-base md:text-xl text-charcoal-600 font-inter max-w-2xl mx-auto">
            Каждые апартаменты созданы для максимального комфорта и роскоши при Вашем проживании
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              room={room}
              currentImageIndex={currentImageIndex}
              onImageChange={onImageChange}
              onHoverChange={onHoverChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;