import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import ContactInfo from '@/components/seo/ContactInfo';
import FAQ from '@/components/seo/FAQ';
import { FizzyButton } from '@/components/ui/fizzy-button';

const Location = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-charcoal-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-playfair text-gold-400 mb-4">
            Апартаменты на Поклонной 9
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            ENZO Отель в Москве — посуточная аренда рядом с Парком Победы
          </p>
          <FizzyButton 
            onClick={handleBooking}
            size="lg"
            className="text-lg px-8 py-6"
            icon={<Icon name="Calendar" size={24} />}
          >
            Забронировать апартаменты на Поклонной 9
          </FizzyButton>
        </header>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6">
            О расположении апартаментов на Поклонной 9
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Удобное расположение в Москве
              </h3>
              <p className="mb-4">
                Апартаменты на короткий срок <strong className="text-gold-400">на Поклонной 9</strong> расположены 
                в одном из самых живописных районов Москвы. ENZO отель находится в шаговой доступности 
                от <strong>Парка Победы</strong> — одного из крупнейших парков столицы.
              </p>
              <p className="mb-4">
                <strong className="text-gold-400">Адрес: г. Москва, ул. Поклонная, д. 9</strong>
              </p>
              <p>
                Посуточная аренда на Поклонной 9 идеально подходит для туристов и деловых 
                путешественников, ценящих комфорт и удобное расположение.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Транспортная доступность
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Icon name="Train" className="text-gold-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong>Метро Парк Победы</strong>
                    <p className="text-sm text-gray-400">7 минут пешком от апартаментов на Поклонной 9</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Bus" className="text-gold-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong>Остановки транспорта</strong>
                    <p className="text-sm text-gray-400">Рядом с ENZO отелем на Поклонной</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Car" className="text-gold-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong>Парковка</strong>
                    <p className="text-sm text-gray-400">Удобная парковка у апартаментов</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6">
            Что рядом с апартаментами на Поклонной 9
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-charcoal-700 p-6 rounded-lg">
              <Icon name="TreePine" className="text-gold-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Парк Победы</h3>
              <p className="text-gray-300 text-sm">
                В 5 минутах пешком от апартаментов на Поклонной 9. 
                Идеально для прогулок и отдыха.
              </p>
            </div>

            <div className="bg-charcoal-700 p-6 rounded-lg">
              <Icon name="Dumbbell" className="text-gold-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Крокус фитнес</h3>
              <p className="text-gray-300 text-sm">
                Крокус фитнес на Поклонной 9 — современный спортивный комплекс 
                в шаговой доступности от ENZO отеля.
              </p>
            </div>

            <div className="bg-charcoal-700 p-6 rounded-lg">
              <Icon name="ShoppingBag" className="text-gold-400 mb-3" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">Инфраструктура</h3>
              <p className="text-gray-300 text-sm">
                Рядом с апартаментами посуточно на Поклонной 9: 
                магазины, рестораны, кафе.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6">
            Преимущества аренды апартаментов на Поклонной 9
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Посуточная аренда на Поклонной 9 без переплат</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Апартаменты на короткий срок с полным оснащением</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>ENZO отель — европейский уровень сервиса</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Рядом с метро Парк Победы и Парком Победы</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Крокус фитнес на Поклонной 9 в пешей доступности</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Удобное расположение в г. Москва, ул. Поклонная 9</span>
              </li>
            </ul>
          </div>
        </section>

        <ContactInfo />

        <FAQ />

        <section className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-xl p-8 border border-gold-500/30 text-center">
          <h2 className="text-3xl font-playfair text-gold-400 mb-4">
            Забронируйте апартаменты на Поклонной 9
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            ENZO отель в Москве предлагает апартаменты на короткий срок и посуточную аренду 
            на Поклонной 9 рядом с Парком Победы и метро Парк Победы. 
            Комфортное проживание у Крокус фитнес на Поклонной 9.
          </p>
          <p className="text-xl text-gold-400 font-semibold mb-6">
            г. Москва, ул. Поклонная, д. 9
          </p>
          <FizzyButton 
            onClick={handleBooking}
            size="lg"
            className="text-lg px-8 py-6"
            icon={<Icon name="CalendarCheck" size={24} />}
          >
            Забронировать сейчас
          </FizzyButton>
        </section>
      </div>

      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <FizzyButton
          onClick={handleBooking}
          size="lg"
          className="shadow-2xl text-base px-6 py-4"
          icon={<Icon name="Phone" size={20} />}
        >
          Забронировать
        </FizzyButton>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
        <FizzyButton
          onClick={handleBooking}
          className="w-full shadow-2xl"
          icon={<Icon name="Phone" size={20} />}
        >
          Забронировать апартаменты
        </FizzyButton>
      </div>
    </div>
  );
};

export default Location;