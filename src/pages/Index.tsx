import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import Footer from '@/components/sections/Footer';

const Index = () => {
  const navigation = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rooms', label: 'Апартаменты', icon: 'Bed' },
    { id: 'contacts', label: 'Контакты', icon: 'Phone' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-charcoal-50 to-white">
      <Header 
        navigation={navigation}
        currentSection="home"
        onNavigate={() => {}}
      />
      <HeroSection onNavigate={() => {}} />
      <Footer />
    </div>
  );
};

export default Index;