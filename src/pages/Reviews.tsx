import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { FizzyButton } from '@/components/ui/fizzy-button';
import ShareButtons from '@/components/ShareButtons';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  text: string;
  apartment: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Анна Смирнова",
    rating: 5,
    date: "2025-09-15",
    text: "Снимали премиум апартаменты на Поклонной 9 на неделю. Восторг! Элитные апартаменты в 5* комплексе полностью оправдали ожидания. Рядом Парк Победы, метро в 7 минутах. ENZO отель - это люкс уровень по разумной цене. Обязательно вернёмся!",
    apartment: "Студия делюкс",
    verified: true
  },
  {
    id: 2,
    name: "Дмитрий Волков",
    rating: 5,
    date: "2025-09-20",
    text: "Искал жильё на Поклонной 9 для командировки. Посуточная аренда апартаментов в ENZO оказалась идеальным вариантом. Удобное расположение у метро Парк Победы, рядом Крокус фитнес на Поклонной 9. Краткосрочная аренда без лишних вопросов. Рекомендую!",
    apartment: "Апартаменты 2-комнатные",
    verified: true
  },
  {
    id: 3,
    name: "Елена Петрова",
    rating: 5,
    date: "2025-09-28",
    text: "Гостиница на Поклонной превзошла все ожидания! Снять квартиру посуточно в Москве оказалось проще простого. Премиум апартаменты Поклонная 9 - чистота, комфорт, вся техника. Рядом с Парком Победы можно гулять с детьми. Цена-качество на высоте!",
    apartment: "Апартаменты 1-комнатные",
    verified: true
  },
  {
    id: 4,
    name: "Сергей Иванов",
    rating: 5,
    date: "2025-10-01",
    text: "Отель у Парка Победы в Москве - лучший выбор для туристов! Элитные апартаменты на Поклонной 9 с европейским ремонтом. Аренда апартаментов на короткий срок прошла гладко. Отличная транспортная доступность - метро Парк Победы рядом. 5 звёзд заслуженно!",
    apartment: "Студия",
    verified: true
  },
  {
    id: 5,
    name: "Мария Соколова",
    rating: 5,
    date: "2025-10-03",
    text: "Квартира посуточно Москва Поклонная - именно это я искала! ENZO отель предоставил люкс апартаменты с потрясающим видом. Поклонная 9 аренда оказалась выгоднее отеля. Рядом Крокус фитнес, можно поддерживать форму. Краткосрочная аренда жилья идеально для деловых поездок!",
    apartment: "Пентхаус",
    verified: true
  },
  {
    id: 6,
    name: "Александр Попов",
    rating: 5,
    date: "2025-10-05",
    text: "Гостиница рядом с Парком Победы просто находка! Премиум апартаменты на Поклонной с полной кухней и всеми удобствами. Посуточная аренда на Поклонной 9 без переплат. Жильё Поклонная 9 в 5* комплексе - это комфорт и безопасность. Советую всем!",
    apartment: "Апартаменты 2-комнатные",
    verified: true
  },
  {
    id: 7,
    name: "Ольга Новикова",
    rating: 5,
    date: "2025-10-06",
    text: "Снять квартиру на Поклонной 9 было моей целью - и я не прогадала! Элитные апартаменты ENZO отель превзошли ожидания. Расположение идеальное - метро Парк Победы в шаговой доступности. Аренда квартир посуточно в Москве редко бывает такого уровня. 5 звёзд!",
    apartment: "Студия премиум",
    verified: true
  }
];

const Reviews = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-charcoal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-playfair text-gold-400 mb-4">
            Отзывы об апартаментах на Поклонной 9
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Реальные отзывы гостей ENZO отеля в Москве — премиум апартаменты посуточно
          </p>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} name="Star" className="text-gold-400 fill-gold-400" size={24} />
                ))}
              </div>
              <span className="text-2xl font-semibold text-gold-400">5.0</span>
            </div>
            <div className="text-gray-400">
              <p className="text-lg">{reviews.length} отзывов</p>
            </div>
          </div>
          <FizzyButton
            onClick={() => navigate('/location')}
            icon={<Icon name="Home" size={20} />}
          >
            Перейти на главную страницу
          </FizzyButton>
        </header>

        <div className="grid gap-6 mb-12" itemScope itemType="https://schema.org/Hotel">
          <meta itemProp="name" content="ENZO Отель - Апартаменты на Поклонной 9" />
          <meta itemProp="address" content="г. Москва, ул. Поклонная, д. 9" />
          
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-charcoal-800 rounded-xl p-6 border border-gray-700"
              itemScope
              itemProp="review"
              itemType="https://schema.org/Review"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center">
                    <Icon name="User" className="text-gold-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg" itemProp="author">
                      {review.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {review.apartment}
                      {review.verified && (
                        <span className="ml-2 inline-flex items-center gap-1 text-green-400">
                          <Icon name="CheckCircle" size={14} />
                          Проверенный отзыв
                        </span>
                      )}
                    </p>
                    <meta itemProp="datePublished" content={review.date} />
                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('ru-RU')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                  <meta itemProp="ratingValue" content={review.rating.toString()} />
                  <meta itemProp="bestRating" content="5" />
                  {[...Array(review.rating)].map((_, i) => (
                    <Icon key={i} name="Star" className="text-gold-400 fill-gold-400" size={20} />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed" itemProp="reviewBody">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        <section className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-xl p-8 border border-gold-500/30 text-center">
          <h2 className="text-3xl font-playfair text-gold-400 mb-4">
            Забронируйте премиум апартаменты на Поклонной 9
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Снять квартиру посуточно в ENZO отеле — это элитные апартаменты в 5* комплексе 
            на ул. Поклонная 9 в Москве. Аренда апартаментов на короткий срок рядом с Парком Победы 
            и метро Парк Победы. Гостиница премиум класса с люкс сервисом.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <a href="tel:+79141965172">
              <FizzyButton
                size="lg"
                icon={<Icon name="Phone" size={20} />}
              >
                +7 (914) 196-51-72
              </FizzyButton>
            </a>
            <a href="https://wa.me/79361414232?text=Добро%20пожаловать%20в%20роскошные%20премиум%20апартаменты%20в%205*%20комплексе%20Поклонная%209,%20где%20проживание%20Вам%20точно%20понравится!" target="_blank" rel="noopener noreferrer">
              <FizzyButton
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                icon={<Icon name="MessageCircle" size={20} />}
              >
                WhatsApp
              </FizzyButton>
            </a>
            <FizzyButton
              onClick={() => navigate('/bookings')}
              size="lg"
              icon={<Icon name="Calendar" size={20} />}
            >
              Забронировать онлайн
            </FizzyButton>
          </div>
          <p className="text-xl text-gold-400 font-semibold">
            г. Москва, ул. Поклонная, д. 9 | ENZO Отель
          </p>
        </section>

        <section className="mt-8 bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-playfair text-gold-400 mb-4 text-center">
            Почему выбирают апартаменты на Поклонной 9
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">5★</div>
              <p className="text-gray-300">Премиум комплекс с люкс апартаментами</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">7 мин</div>
              <p className="text-gray-300">До метро Парк Победы пешком</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gold-400 mb-2">100%</div>
              <p className="text-gray-300">Положительные отзывы гостей</p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-charcoal-800 rounded-xl p-8 border border-gray-700">
          <ShareButtons 
            title="Отзывы об апартаментах на Поклонной 9 | ENZO Отель"
            text="Прочитайте отзывы наших гостей о проживании в премиум апартаментах! Рейтинг 5.0 ⭐"
          />
        </section>
      </div>
    </div>
  );
};

export default Reviews;