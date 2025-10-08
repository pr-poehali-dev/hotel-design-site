-- Таблица для истории выполненных уборок
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.cleaning_history (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    housekeeper_name VARCHAR(255) NOT NULL,
    cleaned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    payment_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid')),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Индекс для быстрого поиска по горничным
CREATE INDEX idx_cleaning_history_housekeeper ON t_p9202093_hotel_design_site.cleaning_history(housekeeper_name);

-- Индекс для быстрого поиска по дате
CREATE INDEX idx_cleaning_history_cleaned_at ON t_p9202093_hotel_design_site.cleaning_history(cleaned_at DESC);

-- Индекс для быстрого поиска неоплаченных
CREATE INDEX idx_cleaning_history_payment_status ON t_p9202093_hotel_design_site.cleaning_history(payment_status);
