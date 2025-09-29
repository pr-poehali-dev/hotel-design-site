export interface Room {
  name: string;
  price: string;
  features: string[];
  image: string;
  gallery?: string[];
  video?: string;
  description?: string;
}

export const rooms: Room[] = [
  {
    name: 'Студия',
    price: '6 500 ₽',
    features: ['PS5 + геймпады и диски', 'Массажное кресло (50+ программ)', 'Телескоп для космоса', 'Стиральная машина с сушкой', '2 Smart TV', 'Отдельная спальня', 'Постирочная комната', 'Индивидуальный лифт', '5★ обслуживание', 'Столешницы из кварца'],
    image: 'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/533d48be-31a4-4b8d-b67f-6e54f57ea44a.jpeg',
      'https://cdn.poehali.dev/files/2202139f-75ce-4af1-8c7a-de66a7c2e431.jpeg',
      'https://cdn.poehali.dev/files/ea0dc8af-de8c-41fb-9865-7379da038018.jpeg',
      'https://cdn.poehali.dev/files/25507b39-2c9d-46be-aa9c-32d23e63323f.jpeg',
      'https://cdn.poehali.dev/files/5eb93d1a-6444-4e64-95a2-ea9b0a834307.jpeg',
      'https://cdn.poehali.dev/files/0cbf887e-c8ab-412b-a372-1728ea656c15.jpeg',
      'https://cdn.poehali.dev/files/fb93407e-b72a-4593-ae8f-d92a21e17e2d.jpeg',
      'https://cdn.poehali.dev/files/25a0718c-903c-4139-a8de-7ecf199f8c93.jpeg',
      'https://cdn.poehali.dev/files/87d169bb-157e-4520-9001-2f8b94f6a3ae.jpeg',
      'https://cdn.poehali.dev/files/76fbc7c3-2929-4fb3-85f5-103fd1973b3b.jpeg',
      'https://cdn.poehali.dev/files/a59d5960-d38b-4f76-a57c-516000294c8a.jpeg',
      'https://cdn.poehali.dev/files/f6a7bb29-e74b-49b7-8609-4258aac8472d.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/82db3dee7024a3465acffc8cd5fb338b',
    description: `Премиум апартамент дизайн студия (гостиная совмещена с кухней + отдельная спальня + постирочная комната) с максимальной комплектацией для комфортного проживания (PS5 игровая консоль с 2 геймпадами и свежими дисками, телескоп для просмотра в космос, массажное кресло с функцией гравитации и более 50 программ) в элитном апарт доме с 5* обслуживанием и индивидуальным лифтом на этаж. Стиральная машинка с функцией сушки, 2 смарт тв, высокоскоростной wi-fi, постельное белье, средства гигиены, паровой утюг, сейф, цифровой замок. Все столешницы из кварца. Проживанием в апартаменте Вы точно останетесь довольны. Предназначен для цивилизованного проживания.`
  },
  {
    name: 'Стандартные апартаменты',
    price: '8 500 ₽',
    features: ['Двуспальная кровать', 'Кондиционер', 'Wi-Fi', 'Мини-бар'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Делюкс с видом',
    price: '12 000 ₽',
    features: ['Панорамные окна', 'Рабочая зона', 'Умный дом', 'Халаты и тапочки'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Люкс апартаменты',
    price: '15 000 ₽',
    features: ['Отдельная гостиная', 'Джакузи', 'Вид на город', 'Завтрак включен'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Семейные апартаменты',
    price: '18 000 ₽',
    features: ['2 спальни', 'Кухня-студия', 'Детская зона', 'Балкон'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Бизнес-люкс',
    price: '22 000 ₽',
    features: ['Кабинет', 'Конференц-связь', 'Экспресс check-in', 'Лаундж-доступ'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Пентхаус',
    price: '28 000 ₽',
    features: ['Терраса 50м²', 'Панорама 360°', 'Сауна', 'Кухня премиум'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Президентские апартаменты',
    price: '35 000 ₽',
    features: ['Панорамный вид', 'Персональный дворецкий', 'Терраса', 'Трансфер'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Королевский люкс',
    price: '45 000 ₽',
    features: ['200м² площади', 'Винный шкаф', 'Домашний кинотеатр', 'Спа-зона'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Компактная студия',
    price: '5 500 ₽',
    features: ['Двуспальная кровать', 'Душевая кабина', 'Wi-Fi', 'Мини-кухня'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Апартаменты с камином',
    price: '19 000 ₽',
    features: ['Биокамин', 'Большая гостиная', 'Вид на парк', 'Премиум-мебель'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Романтик-сюит',
    price: '16 000 ₽',
    features: ['Круглая кровать', 'Джакузи на двоих', 'Шампанское в подарок', 'Лепестки роз'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Панорама-люкс',
    price: '24 000 ₽',
    features: ['Окна от пола до потолка', 'Вид на Москва-Сити', 'Балкон 15м²', 'Телескоп'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Дизайнерские апартаменты',
    price: '26 000 ₽',
    features: ['Авторский дизайн', 'Арт-объекты', 'Эксклюзивная мебель', 'Умное освещение'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Спорт-люкс',
    price: '20 000 ₽',
    features: ['Домашний тренажерный зал', 'Йога-зона', 'Спортивное питание', 'Массажное кресло'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Эко-апартаменты',
    price: '17 000 ₽',
    features: ['Живая стена', 'Очистители воздуха', 'Эко-материалы', 'Зимний сад'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Гранд-сюит',
    price: '52 000 ₽',
    features: ['300м² площади', 'Гардеробная комната', 'Библиотека', 'Бильярдная'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Премиум с террасой',
    price: '31 000 ₽',
    features: ['Терраса 40м²', 'Уличная мебель', 'BBQ-зона', 'Джакузи под небом'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  },
  {
    name: 'Технологичный люкс',
    price: '29 000 ₽',
    features: ['Умный дом премиум', 'VR-зона', 'Игровая консоль', 'Soundbar премиум'],
    image: '/img/d744d6a9-bc23-4f6c-b13a-4481e9bdac3d.jpg'
  }
];