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
  roomId?: string;
}

export const rooms: Room[] = [
  {
    name: '2х комнатный',
    subtitle: 'Aurora',
    price: 'от 18 000 ₽',
    features: ['55 кв.м', '20 этаж', 'Для 1-4 гостей'],
    roomId: '1759773745026',
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
    subtitle: 'Gold Suite',
    price: 'от 30 000 ₽',
    features: ['103 кв.м', '11 этаж', 'Для 1-8 гостей'],
    roomId: '1759775039895',
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
    subtitle: 'Bearbrick Studio',
    price: 'от 15 000 ₽',
    features: ['55 кв.м', '21 этаж', 'Для 1-3 гостей'],
    roomId: '1759774533761',
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
    name: '3х комнатный',
    subtitle: 'Fireplace Luxury',
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
    name: '2х комнатный',
    subtitle: 'Mirror Studio',
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
    name: '3х комнатный',
    subtitle: 'Cozy Corner',
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
    name: '2х комнатный',
    subtitle: 'Vista Point',
    price: 'от 16 000 ₽',
    features: ['55 кв.м', '13 этаж', 'Для 1-4 гостей'],
    image: 'https://cdn.poehali.dev/files/3aa03ad6-b466-43c8-a2d0-f3306e62bd71.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/3aa03ad6-b466-43c8-a2d0-f3306e62bd71.jpeg',
      'https://cdn.poehali.dev/files/7d3b01b3-e0c2-41c6-9263-735eb63ee573.jpeg',
      'https://cdn.poehali.dev/files/18cfc0b4-a790-4f5d-b8de-72cddf3bc403.jpeg',
      'https://cdn.poehali.dev/files/785f9ac7-aa4e-4776-bed6-58e9a0d8e9f7.jpeg',
      'https://cdn.poehali.dev/files/f33a8a29-e295-4c2f-8226-020d78a7e345.jpeg',
      'https://cdn.poehali.dev/files/24fa36f8-05bf-4d73-ac33-3426edca9de1.jpeg',
      'https://cdn.poehali.dev/files/e8a5637e-1c61-415e-b54c-60342d7cde1f.jpeg',
      'https://cdn.poehali.dev/files/07666ce2-bafa-4f55-bbbe-ee2e71f973ce.jpeg',
      'https://cdn.poehali.dev/files/f2dee957-4e9c-4e5f-a361-12ff0a2cd29a.jpeg',
      'https://cdn.poehali.dev/files/9f1a7d6a-dd82-4067-a743-01a51baea1fc.jpeg',
      'https://cdn.poehali.dev/files/9c5fd6f7-cf64-418b-915e-7b6fd29919a9.jpeg',
      'https://cdn.poehali.dev/files/0a1e44a0-1527-4d9c-97d9-8606c618a060.jpeg',
      'https://cdn.poehali.dev/files/53963eb0-646a-4c7e-8f45-dd083ee7b06f.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/6e52bebaee7a4ed67e5225ce03d11086',
    description: `Премиум апартаменты площадью 55 кв.м на 13 этаже с изысканным дизайном в светлых тонах и панорамными окнами.

Апартаменты включают:
• Просторную гостиную с синим велюровым диваном, обеденной зоной и современными дизайнерскими светильниками
• Открытую кухню-студию с островом, деревянными фасадами, белыми столешницами и техникой премиум-класса
• Отдельную спальню с king-size кроватью, встроенным шкафом и дизайнерским освещением
• Роскошную ванную комнату с золотой сантехникой, мраморной отделкой, черным гранитом и душем с золотым тропическим душем
• Прачечную зону со встроенной стиральной и сушильной машинами
• Панорамные окна с видом на город
• Систему климат-контроля и умное освещение
• Высокоскоростной Wi-Fi и СМАРТ ТВ

Элегантный интерьер в бежево-серых тонах с синими акцентами, золотыми деталями и классическими молдингами создает атмосферу утонченной роскоши. Идеально подходит для семейного отдыха и деловых поездок.`
  },
  {
    name: '3х комнатный',
    subtitle: 'Family Joy',
    price: '35 000 ₽',
    features: ['76 кв.м', '21 этаж', 'Для 1-7 гостей'],
    image: 'https://cdn.poehali.dev/files/012948d6-e165-48b8-af95-926a9c5ede43.jpeg',
    gallery: [
      'https://cdn.poehali.dev/files/012948d6-e165-48b8-af95-926a9c5ede43.jpeg',
      'https://cdn.poehali.dev/files/aeed5340-295b-42b1-bede-8efac66a2424.jpeg',
      'https://cdn.poehali.dev/files/f1874c77-794e-4466-88a4-383c02cf5c38.jpeg',
      'https://cdn.poehali.dev/files/af9f1e67-0f68-4ebe-837a-73e4d6192cb7.jpeg',
      'https://cdn.poehali.dev/files/39fd798b-0421-4bd3-9976-bd5b091868ae.jpeg',
      'https://cdn.poehali.dev/files/dbad149a-61e9-4ba0-9bc6-939e24357b50.jpeg',
      'https://cdn.poehali.dev/files/60b80d11-de23-4533-8958-3bf46a2a098a.jpeg',
      'https://cdn.poehali.dev/files/c9968bf1-8547-4115-a678-0726ff774f85.jpeg',
      'https://cdn.poehali.dev/files/bd5fdc7c-cb00-431b-9715-4e09a7bd3998.jpeg',
      'https://cdn.poehali.dev/files/358da28c-efe3-4fde-b31a-2a256dd14b42.jpeg',
      'https://cdn.poehali.dev/files/3dad09c8-5bd1-4117-8b6f-aee3123a861b.jpeg',
      'https://cdn.poehali.dev/files/d761df66-d1a8-4b8b-8b94-13c44b21af39.jpeg',
      'https://cdn.poehali.dev/files/54013a71-c053-4837-bc0a-b807930fbb06.jpeg',
      'https://cdn.poehali.dev/files/ef0a0004-2d70-46af-9ad7-cf9d57285ed1.jpeg'
    ],
    video: 'https://rutube.ru/play/embed/200aa95020d84bb70203b27ec338d779',
    description: `Роскошные апартаменты премиум-класса площадью 76 кв.м на 21 этаже с минималистичным светлым интерьером и панорамными окнами.

Апартаменты включают:
• Просторную гостиную с современным серым диваном, обеденной зоной на 6 персон с горчичными стульями и телевизионной зоной
• Элегантную кухню-студию с островом, серыми глянцевыми фасадами, деревянной столешницей и встроенной техникой премиум-класса
• Отдельную спальню с king-size кроватью, встроенным шкафом и современными картинами в минималистичном стиле
• Две ванные комнаты: одну с золотым зеркалом и отделкой терраццо, вторую с золотым зеркалом и белоснежной отделкой
• Прихожую с полноростовыми зеркалами и вместительными шкафами
• Систему климат-контроля и умное освещение с теплой светодиодной подсветкой
• Высокоскоростной Wi-Fi и СМАРТ ТВ

Утонченный интерьер в бежево-серых тонах с акцентами горчичного цвета, золотыми деталями, отделкой терраццо и минималистичным декором создает атмосферу элегантной роскоши. Идеально подходит для семейного отдыха и деловых поездок.`
  },
  {
    name: '2х комнатный',
    subtitle: 'Cyber Space',
    price: 'от 16 000 ₽',
    features: ['62 кв.м', '9 этаж', 'Для 1-4 гостей'],
    image: 'https://cdn.poehali.dev/files/6c3840e0-1758-453e-bc73-a2d331c5e2af.jpeg',
    video: 'https://rutube.ru/play/embed/8525880a7f5c4da9d07a627dfb178e19',
    gallery: [
      'https://cdn.poehali.dev/files/6c3840e0-1758-453e-bc73-a2d331c5e2af.jpeg',
      'https://cdn.poehali.dev/files/57eaed2b-e0ce-406d-8ddc-0c34a04fa78c.jpeg',
      'https://cdn.poehali.dev/files/4b575036-9929-4dce-bc15-3102f3337404.jpeg',
      'https://cdn.poehali.dev/files/c33fd2a6-b0de-4060-a57a-e53a2bf7062c.jpeg',
      'https://cdn.poehali.dev/files/a352fb3c-8650-4fdf-8a93-30507db8c015.jpeg',
      'https://cdn.poehali.dev/files/109a1331-2e6d-466e-ab6e-72a7e9fd813a.jpeg',
      'https://cdn.poehali.dev/files/34e21322-aa86-4165-8451-cfd3ee63de10.jpeg',
      'https://cdn.poehali.dev/files/626206a8-6972-4d78-95f6-98419523ec7d.jpeg',
      'https://cdn.poehali.dev/files/687cf131-5517-4923-b124-808069480338.jpeg',
      'https://cdn.poehali.dev/files/9d2313b2-300a-45d1-97dc-4cbfe1f852f1.jpeg'
    ],
    description: `Стильные апартаменты премиум-класса площадью 62 кв.м на 9 этаже с элегантным дизайном в светлых тонах и панорамными окнами.

Апартаменты включают:
• Просторную гостиную с современным интерьером и уютной зоной отдыха
• Полностью оборудованную кухню-студию с техникой премиум-класса
• Отдельную спальню с king-size кроватью, роскошной люстрой в виде золотого кольца и LED-подсветкой по периметру потолка
• Ванную комнату с душевой кабиной, выполненной в стиле "елочка", золотым зеркалом и золотой сантехникой
• Прачечную комнату со стиральной машиной и встроенными шкафами для хранения
• Систему умного дома с электронными замками и климат-контролем
• Высокоскоростной Wi-Fi и СМАРТ ТВ

Изысканный интерьер в бежево-серых тонах с золотыми акцентами, дизайнерскими светильниками и качественными материалами создает атмосферу утонченного комфорта. Идеально подходит для семейного отдыха и деловых поездок.`
  },
  {
    name: '3х комнатный',
    subtitle: 'Panorama Suite',
    price: 'от 25 000 ₽',
    features: ['103 кв.м.', '8 этаж', 'Для 1-6 гостей'],
    image: 'https://cdn.poehali.dev/files/e4d338dd-73ef-4be0-bde4-9fb69a695b70.jpeg',
    video: 'https://rutube.ru/play/embed/c9906210eb879cd9705a0ac9ba69e079',
    gallery: [
      'https://cdn.poehali.dev/files/e4d338dd-73ef-4be0-bde4-9fb69a695b70.jpeg',
      'https://cdn.poehali.dev/files/a03fe005-5511-4a8e-9b95-eb8f221985d8.jpeg',
      'https://cdn.poehali.dev/files/b33c912c-a7c7-4f0a-b08c-b76d12a7dbc1.jpeg',
      'https://cdn.poehali.dev/files/3314f479-8753-4105-ad1c-bc72dfc7fdc9.jpeg',
      'https://cdn.poehali.dev/files/55206ca1-254a-44c3-87f9-45858b235ca6.jpeg',
      'https://cdn.poehali.dev/files/310eac73-732b-4b2f-9bc0-9f40e317ee70.jpeg',
      'https://cdn.poehali.dev/files/d514b2f2-ec8e-401b-8e92-2dc9c658482c.jpeg',
      'https://cdn.poehali.dev/files/f640dece-24ba-419d-9069-d7079cb39709.jpeg',
      'https://cdn.poehali.dev/files/d776cc54-509b-48c2-a1ee-9f26e53f03d3.jpeg',
      'https://cdn.poehali.dev/files/9b824665-632e-4d5e-9a2d-0032fde45d8d.jpeg',
      'https://cdn.poehali.dev/files/2925c685-078d-42b6-a863-b6daf1abe08c.jpeg',
      'https://cdn.poehali.dev/files/dffb17bb-dd19-49ea-be35-1a3381b0d04f.jpeg',
      'https://cdn.poehali.dev/files/ad0ec1d7-60c3-4b36-bd96-603aa58dc376.jpeg'
    ],
    description: `Просторные апартаменты площадью 103 кв.м на 8 этаже премиального комплекса Поклонная 9 с современным дизайном в светлых тонах.

Апартаменты включают:
• Просторную гостиную с большим угловым диваном и обеденной зоной
• Полностью оборудованную кухню с современной встроенной техникой премиум-класса
• Две отдельные спальни с комфортными king-size кроватями
• Две ванные комнаты с современной сантехникой и душевыми кабинами
• Прачечную зону со стиральной машиной
• Панорамные окна с видом на город
• Систему климат-контроля
• Высокоскоростной Wi-Fi и СМАРТ ТВ

Светлый интерьер с бежево-белой цветовой гаммой, современной мебелью и продуманной планировкой создает атмосферу комфорта и уюта. Идеально подходит для семейного отдыха или проживания большой компании друзей.`
  }
];