import { useState, useEffect } from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import RoomsSection from '@/components/sections/RoomsSection';
import GallerySection from '@/components/sections/GallerySection';
import PhotoCarousel from '@/components/sections/PhotoCarousel';
import BookingSection from '@/components/sections/BookingSection';
import ContactsSection from '@/components/sections/ContactsSection';
import Footer from '@/components/sections/Footer';
import { rooms } from '@/data/roomsData';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Номера', icon: 'Bed' },
    { id: 'booking', label: 'Бронирование', icon: 'Calendar' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  const hotelImages = [
    { url: 'https://cdn.poehali.dev/files/c967fccf-7cf2-4c56-82ea-8e57d812d0f1.jpeg', title: 'Вид на Поклонную гору' },
    { url: 'https://cdn.poehali.dev/files/d4a44fee-7b1f-466f-b16d-6e7d66cc4b06.jpeg', title: 'Лобби Поклонная 9' },
    { url: 'https://cdn.poehali.dev/files/5c65ea91-ed82-4428-94f5-6b6085637be2.jpeg', title: 'Интерьер апартаментов' },
  ];

  const carouselPhotos = [
    { url: 'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg', title: 'Премиум студия', description: 'Роскошное пространство для комфортного отдыха' },
    { url: 'https://cdn.poehali.dev/files/2202139f-75ce-4af1-8c7a-de66a7c2e431.jpeg', title: 'Современный интерьер', description: 'Дизайнерская мебель и техника премиум-класса' },
    { url: 'https://cdn.poehali.dev/files/ea0dc8af-de8c-41fb-9865-7379da038018.jpeg', title: 'Панорамные виды', description: '20 этаж с видом на город' },
    { url: 'https://cdn.poehali.dev/files/25507b39-2c9d-46be-aa9c-32d23e63323f.jpeg', title: 'Максимальный комфорт', description: 'Все для вашего идеального отдыха' },
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
      <Header 
        navigation={navigation}
        currentSection={currentSection}
        onNavigate={setCurrentSection}
      />

      {currentSection === 'home' && (
        <>
          <HeroSection onNavigate={setCurrentSection} />
          <PhotoCarousel photos={carouselPhotos} />
          <GallerySection hotelImages={hotelImages} />
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

      {currentSection === 'booking' && <BookingSection />}

      {currentSection === 'contacts' && <ContactsSection />}

      <Footer />
    </div>
  );
};

export default Index;