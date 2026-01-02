import { useState } from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import RoomsSection from '@/components/sections/RoomsSection';
import Footer from '@/components/sections/Footer';
import { rooms } from '@/data/roomsData';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Апартаменты', icon: 'Bed' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleImageChange = (delta: number, galleryLength: number) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + delta;
      if (newIndex < 0) return galleryLength - 1;
      if (newIndex >= galleryLength) return 0;
      return newIndex;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal-50 to-white">
      <Header 
        navigation={navigation}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />
      <HeroSection onNavigate={handleNavigate} />
      
      <div id="rooms">
        <RoomsSection 
          rooms={rooms}
          currentImageIndex={currentImageIndex}
          onImageChange={handleImageChange}
          onHoverChange={setIsHovering}
        />
      </div>

      <section id="contacts" className="py-20 px-6 bg-charcoal-50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-center text-charcoal-900 mb-4">
            Контакты
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Свяжитесь с нами удобным способом
          </p>
          <div className="text-center">
            <a 
              href="https://t.me/apartamentsmsk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;