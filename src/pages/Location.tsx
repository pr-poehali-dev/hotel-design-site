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
                <span>Аренда премиум апартаментов на Поклонной 9</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Посуточная аренда квартир на Поклонной 9 без переплат</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Элитные апартаменты с полным оснащением</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>5 звёзд — люкс апартаменты Поклонная 9</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Снять квартиру посуточно у метро Парк Победы</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Краткосрочная аренда жилья на Поклонной</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Гостиница рядом с Парком Победы в Москве</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                <span>Удобное жильё в комплексе Поклонная 9</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-3xl font-playfair text-gold-400 mb-6">
            Популярные запросы для поиска жилья на Поклонной 9
          </h2>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Аренда на Поклонной 9</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Поклонная 9 аренда квартир</li>
                <li>• Снять квартиру Поклонная 9</li>
                <li>• Квартира посуточно Москва Поклонная</li>
                <li>• Жильё Поклонная 9 Москва</li>
              </ul>
            </div>

            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Гостиницы и отели</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Гостиница Поклонная 9</li>
                <li>• Отель у Парка Победы</li>
                <li>• Гостиница метро Парк Победы</li>
                <li>• ENZO отель Москва</li>
              </ul>
            </div>

            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Премиум жильё</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Премиум апартаменты Поклонная</li>
                <li>• 5 звезд апартаменты Москва</li>
                <li>• Элитные апартаменты Поклонная 9</li>
                <li>• Люкс апартаменты Парк Победы</li>
              </ul>
            </div>

            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Краткосрочная аренда</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Посуточная аренда Поклонная 9</li>
                <li>• Краткосрочная аренда Москва</li>
                <li>• Апартаменты на короткий срок</li>
                <li>• Квартира на сутки Поклонная</li>
              </ul>
            </div>

            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Рядом с достопримечательностями</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Жильё у Парка Победы</li>
                <li>• Отель Крокус фитнес Поклонная</li>
                <li>• Апартаменты метро Парк Победы</li>
                <li>• Гостиница рядом с Парком Победы</li>
              </ul>
            </div>

            <div className="bg-charcoal-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gold-400 mb-2">Комфортное проживание</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Комфортные апартаменты Москва</li>
                <li>• Уютное жильё Поклонная 9</li>
                <li>• Апартаменты с удобствами</li>
                <li>• Современное жильё Москва центр</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg">
            <p className="text-center text-gray-300">
              <strong className="text-gold-400">Ищете жильё на Поклонной 9?</strong> 
              {' '}Вы нашли лучший вариант! ENZO отель предлагает премиум апартаменты для аренды 
              на короткий срок и посуточно в 5* комплексе на ул. Поклонная 9 в Москве, 
              рядом с Парком Победы и метро Парк Победы.
            </p>
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

      <div className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col gap-3">
        <a href="https://wa.me/79361414232?text=Добро%20пожаловать%20в%20роскошные%20премиум%20апартаменты%20в%205*%20комплексе%20Поклонная%209,%20где%20проживание%20Вам%20точно%20понравится!" target="_blank" rel="noopener noreferrer">
          <FizzyButton
            size="lg"
            className="shadow-2xl text-base px-6 py-4 w-full bg-green-600 hover:bg-green-700"
            icon={<Icon name="MessageCircle" size={20} />}
          >
            WhatsApp
          </FizzyButton>
        </a>
        <a href="tel:+79141965172">
          <FizzyButton
            size="lg"
            className="shadow-2xl text-base px-6 py-4 w-full"
            icon={<Icon name="Phone" size={20} />}
          >
            +7 (914) 196-51-72
          </FizzyButton>
        </a>
        <FizzyButton
          onClick={handleBooking}
          size="lg"
          className="shadow-2xl text-base px-6 py-4"
          icon={<Icon name="Calendar" size={20} />}
        >
          Забронировать
        </FizzyButton>
      </div>

      <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
        <div className="flex gap-2 mb-2">
          <a href="https://wa.me/79361414232?text=Добро%20пожаловать%20в%20роскошные%20премиум%20апартаменты%20в%205*%20комплексе%20Поклонная%209,%20где%20проживание%20Вам%20точно%20понравится!" target="_blank" rel="noopener noreferrer" className="flex-1">
            <FizzyButton
              className="w-full shadow-2xl bg-green-600 hover:bg-green-700"
              icon={<Icon name="MessageCircle" size={20} />}
            >
              WhatsApp
            </FizzyButton>
          </a>
          <a href="tel:+79141965172" className="flex-1">
            <FizzyButton
              className="w-full shadow-2xl"
              icon={<Icon name="Phone" size={20} />}
            >
              Позвонить
            </FizzyButton>
          </a>
        </div>
        <FizzyButton
          onClick={handleBooking}
          className="w-full shadow-2xl"
          icon={<Icon name="Calendar" size={20} />}
        >
          Забронировать апартаменты
        </FizzyButton>
      </div>
    </div>
  );
};

export default Location;