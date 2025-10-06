import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

const ContactsSection = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-4">
            Наши <span className="text-gold-400">Контакты</span>
          </h2>
          <p className="text-base md:text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Свяжитесь с нами для бронирования или получения дополнительной информации
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl border-0">
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-charcoal-900 mb-6">Контактная информация</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="MapPin" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Адрес</h4>
                  <p className="text-charcoal-600">г.Москва ул. Поклонная дом 9</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Телефон</h4>
                  <p className="text-charcoal-600">+7 914 196 51 72</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">WhatsApp</h4>
                  <a href="https://wa.me/79141965172" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition-colors">
                    +7 914 196 51 72
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Email</h4>
                  <p className="text-charcoal-600">hab-agent@mail.ru</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Время работы</h4>
                  <p className="text-charcoal-600">24/7</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white shadow-2xl border-0">
            <h3 className="text-xl md:text-2xl font-playfair font-bold text-charcoal-900 mb-6">Связаться с нами</h3>
            <div className="space-y-4">
              <p className="text-charcoal-600 font-inter mb-6">
                Напишите нам в WhatsApp для быстрой связи
              </p>
              
              <a 
                href="https://wa.me/79141965172"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FizzyButton 
                  className="w-full bg-green-500 hover:bg-green-600"
                  icon={<Icon name="MessageCircle" size={18} />}
                >
                  Написать в WhatsApp
                </FizzyButton>
              </a>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-charcoal-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-charcoal-500 font-inter">или</span>
                </div>
              </div>
              
              <a 
                href="mailto:hab-agent@mail.ru"
                className="block"
              >
                <FizzyButton 
                  className="w-full"
                  variant="secondary"
                  icon={<Icon name="Mail" size={18} />}
                >
                  Написать на Email
                </FizzyButton>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;