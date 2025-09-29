import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  return (
    <section className="relative h-screen bg-gradient-to-r from-charcoal-900 to-charcoal-800 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(https://cdn.poehali.dev/files/e72382bc-f047-402a-98e0-e7045041f247.png)` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-charcoal-900/40"></div>
      
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h2 className="text-6xl md:text-8xl font-playfair font-bold mb-6 animate-fade-in">
          Роскошь и <span className="text-gold-400">Элегантность</span>
        </h2>
        <p className="md:text-2xl font-inter mb-8 text-gray-200 animate-fade-in-slow text-lg">
          Видовые апартаменты 5* комплекса Поклонная 9
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
          <Button
            onClick={() => onNavigate('booking')}
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
    </section>
  );
};

export default HeroSection;