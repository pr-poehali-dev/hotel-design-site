import { useState } from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import ApartmentsSlider from '@/components/sections/ApartmentsSlider';
import RoomsSection from '@/components/sections/RoomsSection';
import BookingSection from '@/components/sections/BookingSection';
import ContactsSection from '@/components/sections/ContactsSection';
import ProfileSection from '@/components/sections/ProfileSection';
import PromotionsSection from '@/components/sections/PromotionsSection';
import CulturalActivitiesSection from '@/components/sections/CulturalActivitiesSection';
import CulturalSliderSection from '@/components/sections/CulturalSliderSection';
import BookingPromoSection from '@/components/sections/BookingPromoSection';
import Footer from '@/components/sections/Footer';
import FallingLeaves from '@/components/effects/FallingLeaves';
import ShareButtons from '@/components/ShareButtons';
import P9AppBanner from '@/components/P9AppBanner';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';
import { rooms } from '@/data/roomsData';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Апартаменты', icon: 'Bed' },
    { id: 'promotions', label: 'Акции', icon: 'Gift' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
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
        <>
          <HeroSection onNavigate={setCurrentSection} />
          <ApartmentsSlider onNavigate={setCurrentSection} />
          <BookingPromoSection onNavigate={setCurrentSection} />
          <CulturalSliderSection />
        </>
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

      {currentSection === 'culture' && <CulturalActivitiesSection />}

      {currentSection === 'booking' && <BookingSection />}

      {currentSection === 'profile' && <ProfileSection />}

      {currentSection === 'contacts' && <ContactsSection />}

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gold/20">
            <ShareButtons 
              title="Апартаменты на Поклонной 9 | ENZO Отель Москва"
              text="Премиум апартаменты посуточно рядом с Парком Победы. 5 звёзд, все удобства!"
            />
          </div>
          <div className="lg:sticky lg:top-24 h-fit">
            <P9AppBanner />
          </div>
        </div>
      </section>

      <Footer />
      <PushNotificationPrompt />
    </div>
  );
};

export default Index;