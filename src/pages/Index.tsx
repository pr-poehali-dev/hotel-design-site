import { useState } from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import RoomsSection from '@/components/sections/RoomsSection';
import VideoSliderSection from '@/components/sections/VideoSliderSection';
import BookingSection from '@/components/sections/BookingSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ProfileSection from '@/components/sections/ProfileSection';
import PromotionsSection from '@/components/sections/PromotionsSection';
import Footer from '@/components/sections/Footer';
import FallingLeaves from '@/components/effects/FallingLeaves';
import { rooms } from '@/data/roomsData';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Апартаменты', icon: 'Bed' },
    { id: 'promotions', label: 'Акции', icon: 'Gift' },
    { id: 'booking', label: 'Бронирование', icon: 'Calendar' },
    { id: 'profile', label: 'Личный кабинет', icon: 'User' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  const hotelImages = [
    { url: 'https://cdn.poehali.dev/files/c967fccf-7cf2-4c56-82ea-8e57d812d0f1.jpeg', title: 'Вид на Поклонную гору' },
    { url: 'https://cdn.poehali.dev/files/d4a44fee-7b1f-466f-b16d-6e7d66cc4b06.jpeg', title: 'Лобби Поклонная 9' },
    { url: 'https://cdn.poehali.dev/files/5c65ea91-ed82-4428-94f5-6b6085637be2.jpeg', title: 'Интерьер апартаментов' },
  ];

  const handleImageChange = (delta: number, galleryLength: number) => {
    setCurrentImageIndex((prev) => {
      if (delta > 0) {
        return (prev + 1) % galleryLength;
      } else {
        return (prev - 1 + galleryLength) % galleryLength;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal-50 to-white">
      <FallingLeaves />
      <Header 
        navigation={navigation}
        currentSection={currentSection}
        onNavigate={setCurrentSection}
      />

      {currentSection === 'home' && (
        <HeroSection onNavigate={setCurrentSection} />
      )}

      {currentSection === 'rooms' && (
        <RoomsSection 
          rooms={rooms}
          currentImageIndex={currentImageIndex}
          onImageChange={handleImageChange}
          onHoverChange={setIsHovering}
        />
      )}

      {currentSection === 'promotions' && <PromotionsSection />}

      {currentSection === 'booking' && <BookingSection />}

      {currentSection === 'profile' && <ProfileSection />}

      {currentSection === 'contacts' && <ContactsSection />}

      <Footer />
    </div>
  );
};

export default Index;