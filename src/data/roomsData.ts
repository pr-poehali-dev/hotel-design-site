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
    name: '3х комнатный 1116',
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
    name: '2х комнатный 2119',
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
    name: '3х комнатный 2110',
    price: 'от 30 000 ₽',
    features: ['85 кв.м.', '21 этаж', 'Для 1-5 гостей'],
    image: 'https://cdn.poehali.dev/files/b6a25376-5125-4ebb-bfdf-9a419c0ae887.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/b6a25376-5125-4ebb-bfdf-9a419c0ae887.jpeg',
      'https://cdn.poehali.dev/files/e56ba440-39f4-4886-9c3e-fe43fa9083b8.jpeg',
      'https://cdn.poehali.dev/files/9890098f-54bc-44fc-ac9e-acb50d171232.jpeg',
      'https://cdn.poehali.dev/files/0c232eed-4bc1-4b85-a615-02710ba8fb7f.jpeg',
      'https://cdn.poehali.dev/files/28d372bc-5eaf-4523-9b09-3d919fefe8d4.jpeg',
      'https://cdn.poehali.dev/files/54083259-1d2f-4bb7-a14a-23116623616c.jpeg',
      'https://cdn.poehali.dev/files/be3c3327-2592-44a1-a413-0ac25e1e2c97.jpeg',
      'https://cdn.poehali.dev/files/302c60e8-3ac3-431d-8898-bdbf0bb47727.jpeg',
      'https://cdn.poehali.dev/files/f4f9d4ee-e71c-49bf-9352-e864d30a028d.jpeg',
      'https://cdn.poehali.dev/files/67566aaf-0387-4492-a64a-d28b7849e207.jpeg',
      'https://cdn.poehali.dev/files/e6dc49fa-ef95-476f-9634-6c02ad3546aa.jpeg',
      'https://cdn.poehali.dev/files/46413ed4-b4aa-4728-bd3d-00befb6e6203.jpeg',
      'https://cdn.poehali.dev/files/f0e96b2e-af78-42f3-b754-cb8f45c032a6.jpeg',
      'https://cdn.poehali.dev/files/5a5cefb1-f4a4-4b52-ad6b-62a877b5f827.jpeg',
      'https://cdn.poehali.dev/files/fa9d4fc8-14a5-4ebe-9464-77bde4378289.jpeg',
      'https://cdn.poehali.dev/files/537513b6-ac7b-44fb-8034-a757bfe91f12.jpeg',
      'https://cdn.poehali.dev/files/c2571e4f-c883-492c-85b1-3dca076472d8.jpeg',
      'https://cdn.poehali.dev/files/3d41f3b3-04fe-48e5-b175-701d6d388673.jpeg',
      'https://cdn.poehali.dev/files/89442009-f2c5-4c70-a20e-d96925c86531.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/a4e23a4b59896506ce710117cb72a3b0',
    description: `Роскошные апартаменты премиум-класса площадью 85 кв.м с панорамными окнами и дизайнерским интерьером. 

Апартаменты включают:
• Просторную гостиную с уютной зоной отдыха и камином
• Современную кухню с островом и техникой премиум-класса
• Спальню с king-size кроватью
• 2 ванные комнаты: одну с полноценной ванной и душем, вторую с душевой кабиной
• Стиральную и сушильную машину
• Панорамные окна с видом на город
• Дизайнерские светильники и декор
• Станцию Алиса для голосового управления

Стильное пространство с оранжевыми акцентами, натуральным деревом и современной мебелью создает атмосферу роскоши и комфорта. Идеально подходит для романтического отдыха или важных деловых встреч.`
  },
  {
    name: '2х комнатный 1401',
    price: 'от 16 000 ₽',
    features: ['55 кв.м', '14 этаж', 'Для 1-4 гостей'],
    image: 'https://cdn.poehali.dev/files/8f879dcd-c984-4f0f-ac55-29ca3680453e.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/8f879dcd-c984-4f0f-ac55-29ca3680453e.jpeg',
      'https://cdn.poehali.dev/files/79ae4e56-62d6-4bc8-8ab5-90c626cf7162.jpeg',
      'https://cdn.poehali.dev/files/8c684a8a-ff89-49a1-b2a0-4ff8a170da71.jpeg',
      'https://cdn.poehali.dev/files/fcccd990-9809-4aa5-a50f-931b6863bb85.jpeg',
      'https://cdn.poehali.dev/files/928f6dc0-1ef2-48c9-86c4-1b9ddadfce01.jpeg',
      'https://cdn.poehali.dev/files/a2b7313d-e332-4161-902e-9313f05e919b.jpeg',
      'https://cdn.poehali.dev/files/933ec1c5-11d6-4d98-ab4f-9123f2527014.jpeg',
      'https://cdn.poehali.dev/files/89679a85-68a9-4167-8cb4-2c35312b17c5.jpeg',
      'https://cdn.poehali.dev/files/e6fbe404-f8fb-4f08-af22-74b52bf2b51b.jpeg',
      'https://cdn.poehali.dev/files/44c5a78e-7210-4a0a-a266-0bb000b7d942.jpeg',
      'https://cdn.poehali.dev/files/c0ec9815-9ef8-4ee3-b858-ab582a399297.jpeg',
      'https://cdn.poehali.dev/files/fa995feb-6e2f-41f3-a86e-cc48e1bba0a8.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/1d5d5c67e7fcccf057e2ecfcabe050e2',
    description: `Современные апартаменты площадью 55 кв.м с продуманной планировкой для комфортного семейного проживания.

Апартаменты включают:
• Просторную гостиную с удобной зоной отдыха
• Отдельную спальню с king-size кроватью и встроенным шкафом-купе
• Дополнительную рабочую зону с письменным столом
• Современную кухню-студию с островом, золотыми акцентами и встроенной техникой премиум-класса
• Ванную комнату с душевой кабиной
• Прачечную комнату со стиральной и сушильной машинами Miele
• Панорамные окна с дизайнерскими бежево-бордовыми шторами и видом на город
• Систему умного дома с электронным замком
• Высокоскоростной Wi-Fi и СМАРТ ТВ

Светлый интерьер с бежево-серой цветовой гаммой, элегантными светильниками и классическими молдингами создает атмосферу уюта и спокойствия. Проживанием в апартаменте Вам точно понравится.`
  },
  {
    name: '3х комнатный 2817',
    price: '22 000 ₽',
    features: ['67 кв.м', '28 этаж', 'Для 1-6 гостей'],
    image: 'https://cdn.poehali.dev/files/e934d488-eb41-474b-87f8-42cc10c4787f.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/e934d488-eb41-474b-87f8-42cc10c4787f.jpeg',
      'https://cdn.poehali.dev/files/6d6e87bb-c40b-411d-9988-44f3e38c5b7a.jpeg',
      'https://cdn.poehali.dev/files/c36c278e-8900-41c5-9b44-fc6ad2225212.jpeg',
      'https://cdn.poehali.dev/files/159536dd-b067-4ba8-9b03-1f9bb92180cd.jpeg',
      'https://cdn.poehali.dev/files/f4e945c1-d9bc-4c70-9c52-5b0380ecaa50.jpeg',
      'https://cdn.poehali.dev/files/60cdaed3-cf0b-43f1-832c-d08d2dd7baca.jpeg',
      'https://cdn.poehali.dev/files/ede63ff6-1e99-47c6-8dc7-08bd8c107672.jpeg',
      'https://cdn.poehali.dev/files/e97b7f35-f465-4fda-a6cb-ceccf1d5262b.jpeg',
      'https://cdn.poehali.dev/files/9db7e0fb-f9b8-47ce-b715-8e20979636aa.jpeg',
      'https://cdn.poehali.dev/files/f3da8738-7b51-466f-bf2b-9d72d4857b82.jpeg',
      'https://cdn.poehali.dev/files/263b8b3b-581b-4311-94e0-b301c6cece86.jpeg',
      'https://cdn.poehali.dev/files/ffb312b2-a659-4b4b-838a-19576e238e71.jpeg',
      'https://cdn.poehali.dev/files/c75eee12-e7ca-4ecc-81a2-24e5f7ec5eb5.jpeg',
      'https://cdn.poehali.dev/files/d8dd2596-aa06-4ef1-be1f-449adabf73cc.jpeg',
      'https://cdn.poehali.dev/files/8194b645-15a6-47e8-a842-60d3e44a14a4.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/ee4bef7920b0c623328ffcb825fe8ec9',
    description: `Элегантные апартаменты бизнес-класса площадью 67 кв.м на 28 этаже с панорамными окнами и современным дизайном.

Апартаменты включают:
• Просторную гостиную с комфортной зоной отдыха и велюровым диваном
• Отдельную спальню с king-size кроватью, мягким изголовьем с золотыми акцентами и встроенным шкафом
• Современную кухню-студию с островом, мраморной столешницей, черным фартуком и техникой премиум-класса
• Ванную комнату с зеркальной тумбой, круглым зеркалом в золотой раме и золотой сантехникой
• Душевую зону с мраморной отделкой и тропическим душем
• Прачечную комнату со стиральной и сушильной машинами
• Панорамные окна с видом на город и плотными серыми шторами
• СМАРТ ТВ в спальне и гостиной
• Систему климат-контроля
• Высокоскоростной Wi-Fi

Светлый интерьер в бежево-серых тонах с классическими молдингами, золотыми акцентами и дизайнерскими светильниками создает атмосферу утонченной роскоши. Идеально подходит для деловых поездок и семейного отдыха.`
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
    image: 'https://cdn.poehali.dev/files/012948d6-e165-48b8-af95-926a9c5ede43.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/012948d6-e165-48b8-af95-926a9c5ede43.jpeg',
      'https://cdn.poehali.dev/files/aeed5340-295b-42b1-bede-8efac66a2424.jpeg',
      'https://cdn.poehali.dev/files/f1874c77-794e-4466-88a4-383c02cf5c38.jpeg',
      'https://cdn.poehali.dev/files/af9f1e67-0f68-4ebe-837a-73e4d6192cb7.jpeg',
      'https://cdn.poehali.dev/files/39fd798b-0421-4bd3-9976-bd5b091868ae.jpeg'
    ]
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