-- Создание таблицы для отчетов собственников апартаментов
CREATE TABLE owner_reports (
    id SERIAL PRIMARY KEY,
    apartment_number VARCHAR(50) NOT NULL,
    
    -- Даты
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    
    -- Ранние бронирования
    early_check_in TIME,
    late_check_out TIME,
    early_parking TIME,
    
    -- Финансовая информация
    booking_sum DECIMAL(10, 2) NOT NULL,
    total_sum DECIMAL(10, 2) NOT NULL,
    commission_percent DECIMAL(5, 2) DEFAULT 25.00,
    usn_percent DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Комиссии
    commission_before_usn DECIMAL(10, 2),
    commission_after_usn DECIMAL(10, 2),
    commission_management_15 DECIMAL(10, 2),
    
    -- Остатки и затраты
    remaining_before_expenses DECIMAL(10, 2),
    remaining_after_expenses DECIMAL(10, 2),
    expenses_on_operations DECIMAL(10, 2),
    
    -- Средства и выплаты
    average_cleaning DECIMAL(10, 2),
    owner_payment DECIMAL(10, 2),
    payment_date DATE,
    
    -- Дополнительные расходы
    hot_water DECIMAL(10, 2) DEFAULT 0.00,
    chemical_cleaning DECIMAL(10, 2) DEFAULT 0.00,
    hygiene_ср_ва DECIMAL(10, 2) DEFAULT 0.00,
    transportation DECIMAL(10, 2) DEFAULT 0.00,
    utilities DECIMAL(10, 2) DEFAULT 0.00,
    other DECIMAL(10, 2) DEFAULT 0.00,
    note_to_billing TEXT,
    
    -- Метаданные
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_apartment_number ON owner_reports(apartment_number);
CREATE INDEX idx_check_in_date ON owner_reports(check_in_date);
CREATE INDEX idx_payment_date ON owner_reports(payment_date);

-- Комментарии к таблице
COMMENT ON TABLE owner_reports IS 'Таблица для хранения отчетов собственников апартаментов';
COMMENT ON COLUMN owner_reports.apartment_number IS 'Номер апартамента (например, 816)';
COMMENT ON COLUMN owner_reports.commission_percent IS 'Процент комиссии (по умолчанию 25%)';
COMMENT ON COLUMN owner_reports.usn_percent IS 'Процент УСН';
COMMENT ON COLUMN owner_reports.commission_management_15 IS 'Комиссия управление 15%';