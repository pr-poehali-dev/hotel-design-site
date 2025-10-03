-- Создание таблицы задач на уборку
CREATE TABLE IF NOT EXISTS cleaning_tasks (
    id SERIAL PRIMARY KEY,
    apartment_id VARCHAR(50) NOT NULL,
    booking_id INTEGER,
    maid_id INTEGER,
    cleaning_date DATE NOT NULL,
    cleaning_type VARCHAR(20) CHECK (cleaning_type IN ('checkout', 'checkin', 'daily', 'deep')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
    payment_amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Создание таблицы выплат горничным
CREATE TABLE IF NOT EXISTS maid_payments (
    id SERIAL PRIMARY KEY,
    maid_id INTEGER NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_cleanings INTEGER DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0,
    paid_date DATE,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'transfer')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_maid ON cleaning_tasks(maid_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_date ON cleaning_tasks(cleaning_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON cleaning_tasks(status);
CREATE INDEX IF NOT EXISTS idx_maid_payments_maid ON maid_payments(maid_id);
CREATE INDEX IF NOT EXISTS idx_maid_payments_period ON maid_payments(period_start, period_end);