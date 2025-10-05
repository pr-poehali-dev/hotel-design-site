-- Создаем таблицу для инструкций по заселению
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.check_in_instructions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    apartment_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    images TEXT[], -- массив ссылок на изображения
    instruction_text TEXT,
    important_notes TEXT,
    contact_info TEXT,
    wifi_info TEXT,
    parking_info TEXT,
    house_rules TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создаем индекс для быстрого поиска по apartment_id
CREATE INDEX IF NOT EXISTS idx_instructions_apartment ON t_p9202093_hotel_design_site.check_in_instructions(apartment_id);

-- Добавляем комментарии
COMMENT ON TABLE t_p9202093_hotel_design_site.check_in_instructions IS 'Инструкции по заселению для гостей';
COMMENT ON COLUMN t_p9202093_hotel_design_site.check_in_instructions.images IS 'Массив URL изображений для инструкции';
