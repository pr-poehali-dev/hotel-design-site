-- Add Bearbrick Studio apartment to rooms table
INSERT INTO t_p9202093_hotel_design_site.rooms (
    id, 
    number, 
    floor, 
    status, 
    bnovo_name, 
    price_per_night, 
    max_guests, 
    bedrooms, 
    bathrooms, 
    area,
    description,
    created_at,
    updated_at
) VALUES (
    '1759775530117',
    '2117',
    21,
    'available',
    'Поклонная 9 - 2х комнатный Bearbrick Studio',
    22000,
    3,
    2,
    1,
    55,
    'Премиум апартамент в 5* комплексе Поклонная 9. Бэллман, Личный администратор, Охрана, Подземный паркинг. Апартамент с максимальной комплектацией в идеальном состоянии. Смарт тв Samsung 85 диагональ, Смарт тв Samsung 55 диагональ, Игровая консоль PS 5 с играми, Яндекс станция Алиса, Высокоскоростной интернет, Постельное белье страйп сатин, средства гигиены, Техника SMEG, зерновая кофемашина.',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    bnovo_name = EXCLUDED.bnovo_name,
    price_per_night = EXCLUDED.price_per_night,
    max_guests = EXCLUDED.max_guests,
    bedrooms = EXCLUDED.bedrooms,
    bathrooms = EXCLUDED.bathrooms,
    area = EXCLUDED.area,
    description = EXCLUDED.description,
    updated_at = NOW();
