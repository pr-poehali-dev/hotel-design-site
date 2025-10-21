-- Создаём новую таблицу календаря с правильной структурой (используем номера апартаментов как в bookings)
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.calendar_bnovo (
    id SERIAL PRIMARY KEY,
    apartment_id VARCHAR(50) NOT NULL,  -- Номер апартамента (1116, 1401, 2019 и т.д.)
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    booking_id TEXT,
    bnovo_id TEXT,  -- ID бронирования из Bnovo
    guest_name VARCHAR(255),
    price NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(apartment_id, date)
);

CREATE INDEX idx_calendar_bnovo_apartment_date ON t_p9202093_hotel_design_site.calendar_bnovo(apartment_id, date);
CREATE INDEX idx_calendar_bnovo_booking ON t_p9202093_hotel_design_site.calendar_bnovo(booking_id);
CREATE INDEX idx_calendar_bnovo_bnovo_id ON t_p9202093_hotel_design_site.calendar_bnovo(bnovo_id);