import { Card } from '@/components/ui/card';
import { FizzyButton } from '@/components/ui/fizzy-button';
import Icon from '@/components/ui/icon';

const ContactsSection = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair font-bold text-white mb-4">
            Наши <span className="text-gold-400">Контакты</span>
          </h2>
          <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
            Свяжитесь с нами для бронирования или получения дополнительной информации
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <Card className="p-8 bg-white shadow-2xl border-0">
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6">Контактная информация</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="MapPin" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Адрес</h4>
                  <p className="text-charcoal-600">ул. Тверская, 12, Москва, 125009</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Телефон</h4>
                  <p className="text-charcoal-600">+7 (495) 123-45-67</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-charcoal-900" />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal-900 font-inter">Email</h4>
                  <p className="text-charcoal-600">info@grandpalace.ru</p>
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
            <h3 className="text-2xl font-playfair font-bold text-charcoal-900 mb-6">Связаться с нами</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Имя</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="Ваше имя"
                />
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-charcoal-700 font-semibold mb-2 font-inter">Сообщение</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-charcoal-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200 transition-all resize-none"
                  placeholder="Ваше сообщение..."
                ></textarea>
              </div>
              
              <FizzyButton 
                className="w-full"
                icon={<Icon name="Send" size={18} />}
              >
                Отправить сообщение
              </FizzyButton>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;