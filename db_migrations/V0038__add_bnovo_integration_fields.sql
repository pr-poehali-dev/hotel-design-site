-- Добавляем поля для интеграции с Bnovo в таблицу rooms
ALTER TABLE t_p9202093_hotel_design_site.rooms 
ADD COLUMN IF NOT EXISTS bnovo_id INTEGER UNIQUE,
ADD COLUMN IF NOT EXISTS bnovo_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS price_per_night DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS max_guests INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS area DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS address TEXT;

-- Добавляем поля для синхронизации с Bnovo в таблицу bookings
ALTER TABLE t_p9202093_hotel_design_site.bookings
ADD COLUMN IF NOT EXISTS bnovo_id INTEGER UNIQUE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'confirmed',
ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'bnovo',
ADD COLUMN IF NOT EXISTS guests_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Создаём таблицу календаря доступности
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.availability_calendar (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) REFERENCES t_p9202093_hotel_design_site.rooms(id),
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    booking_id TEXT REFERENCES t_p9202093_hotel_design_site.bookings(id),
    price DECIMAL(10, 2),
    UNIQUE(room_id, date)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_calendar_room_date ON t_p9202093_hotel_design_site.availability_calendar(room_id, date);
CREATE INDEX IF NOT EXISTS idx_calendar_available ON t_p9202093_hotel_design_site.availability_calendar(is_available, date);
CREATE INDEX IF NOT EXISTS idx_bookings_bnovo ON t_p9202093_hotel_design_site.bookings(bnovo_id);