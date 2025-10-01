export interface Room {
  name: string;
  subtitle?: string;
  price: string;
  features: string[];
  image: string;
  gallery?: string[];
  video?: string;
  description?: string;
  bookingUrl?: string;
}

export const rooms: Room[] = [
  {
    name: '2х комнатный 2019',
    subtitle: 'с одной спальней',
    price: 'от 15 000 ₽',
    features: ['55 кв.м', '20 этаж', 'Для 1-4 гостей'],
    bookingUrl: 'https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&utm_source=share_from_pms&scroll_to_rooms=1&token=07f1a&is_auto_search=0&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=0&insidePopup=0&dfrom=29-12-2025&dto=31-12-2025&adults=1',
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
    name: '3х комнатный',
    subtitle: 'с двумя спальнями',
    price: 'от 30 000 ₽',
    features: ['103 кв.м', '11 этаж', 'Для 1-8 гостей'],
    bookingUrl: 'https://reservationsteps.ru/rooms/index/c47ec0f6-fcf8-4ff4-85b4-5e4a67dc2981?lang=ru&scroll_to_rooms=1&is_auto_search=1&colorSchemePreview=0&onlyrooms=&name=&surname=&email=&phone=&orderid=&servicemode=0&firstroom=0&vkapp=&insidePopup=0&exval=dev5765_B%7Cdev1185_A%7Cdev10318_B&dfrom=30-09-2025&dto=01-10-2025&adults=2',
    image: 'https://cdn.poehali.dev/files/6f0ed973-147a-41eb-ab38-905af974cf91.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/6f0ed973-147a-41eb-ab38-905af974cf91.jpeg',
      'https://cdn.poehali.dev/files/c3a1d1b3-55fd-4d08-96fe-9a3aad7c0ca6.jpeg',
      'https://cdn.poehali.dev/files/099b0815-3a77-4d6f-a7c6-c9a2cfa4ac35.jpeg',
      'https://cdn.poehali.dev/files/fe3d4115-6cd1-47a3-b7df-6caaf175ce6c.jpeg',
      'https://cdn.poehali.dev/files/9112acfd-67df-40e9-b59c-cc44558f5b0c.jpeg',
      'https://cdn.poehali.dev/files/14802609-1da5-4e2c-9377-bb01c0d24702.jpeg',
      'https://cdn.poehali.dev/files/5fbb8346-5b5f-4db6-b28b-6b2e116a3401.jpeg',
      'https://cdn.poehali.dev/files/1ad8995c-15bd-4d4c-b418-bf8b8b83097c.jpeg',
      'https://cdn.poehali.dev/files/4e26459b-313e-4640-8738-385229902d00.jpeg',
      'https://cdn.poehali.dev/files/cc6e4499-82db-4622-a922-180994d2050e.jpeg',
      'https://cdn.poehali.dev/files/2be54365-b849-4b30-a373-0fa0a834428a.JPG',
      'https://cdn.poehali.dev/files/39d9762f-e85a-4f62-b821-77933711d3b5.jpeg',
      'https://cdn.poehali.dev/files/e690aa35-fe03-41ef-9691-09d18835e75e.JPG'
    ],
    video: 'https://rutube.ru/play/embed/327929ffd82f8511a171d3ec552d3f2a',
    description: `Стильные апартаменты с панорамными окнами и видом на Поклонную гору. Дизайн-студия с современной планировкой, элегантной кухней с мраморными столешницами и золотыми акцентами, просторной гостиной зоной и отдельной спальней. Кристальные люстры, качественная мебель и техника создают атмосферу роскоши и комфорта. Идеально подходит для пар и небольших семей, ценящих стиль и уют.

Мастер спальня со своим с/у, 2 с/у, современный камин, игровая консоль PS5, Яндекс станция Алиса, 3 СМАРТ ТВ.`
  },
  {
    name: '2х комнатный',
    subtitle: 'с одной спальней',
    price: 'от 15 000 ₽',
    features: ['55 кв.м', '21 этаж', 'Для 1-3 гостей'],
    image: 'https://cdn.poehali.dev/files/a4100017-9df0-4397-92e6-d2aeaa753c75.JPG',
    gallery: [
      'https://cdn.poehali.dev/files/a4100017-9df0-4397-92e6-d2aeaa753c75.JPG',
      'https://cdn.poehali.dev/files/55acead2-0496-4df8-b575-d3f72ccbffb5.JPG',
      'https://cdn.poehali.dev/files/369f5567-94eb-40d2-a25f-40b6a0f552c8.JPG',
      'https://cdn.poehali.dev/files/05515bb9-a2f9-4135-a141-7c3ccd443802.JPG',
      'https://cdn.poehali.dev/files/9df72768-10ab-46ca-94e1-26d85c11b468.JPG',
      'https://cdn.poehali.dev/files/2e18f152-b9e5-42da-aa23-ac7242a9caa5.JPG',
      'https://cdn.poehali.dev/files/afb41918-c104-4eca-a369-c1983427756b.JPG',
      'https://cdn.poehali.dev/files/ef6ffebb-89b0-4ba3-9e00-f9f0d307123d.JPG',
      'https://cdn.poehali.dev/files/086c4d9c-643a-4e33-a9e7-011f7d010238.JPG',
      'https://cdn.poehali.dev/files/2d3161e3-a849-4afb-ad6b-44677cc6bf85.JPG'
    ],
    video: 'https://rutube.ru/play/embed/6814355a6755cd0221b3b2d9a3bf4992',
    description: `Премиум апартамент в 5* комплексе Поклонная 9
Бэллман
Личный администратор 
Охрана 
Подземный паркинг
Апартамент с максимальной комплектацией в идеальном состоянии. 
Смарт тв Samsung 85 диагональ 
Смарт тв Samsung 55 диагональ
Игровая консоль PS 5 с играми 
Яндекс станция Алиса
Высокоскоростной интернет
Постельное белье страйп сатин, средства гигиены. 
Техника SMEG, зерновая кофемашина. 
Апартамент Вам точно понравится.`
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