import { useState } from 'react';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/sections/Footer';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal-50 to-white">
      <Header 
        navigation={navigation}
        currentSection={currentSection}
        onNavigate={handleNavigate}
      />
      <HeroSection onNavigate={handleNavigate} />
      
      <section id="rooms" className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-center text-charcoal-900 mb-4">
            Наши Апартаменты
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Выберите идеальное место для вашего отдыха
          </p>
          <div className="text-center text-gray-500">
            Каталог апартаментов в разработке
          </div>
        </div>
      </section>

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