-- Таблица для хранения горничных (упрощенная версия)
CREATE TABLE IF NOT EXISTS housekeepers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для хранения комнат и их статусов
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(50) PRIMARY KEY,
  number VARCHAR(20) NOT NULL,
  floor INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'dirty',
  assigned_to VARCHAR(100),
  last_cleaned TIMESTAMP,
  check_out VARCHAR(10),
  check_in VARCHAR(10),
  priority VARCHAR(10) DEFAULT 'normal',
  notes TEXT,
  payment DECIMAL(10,2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_assigned_to ON rooms(assigned_to);

-- Вставляем горничных по умолчанию
INSERT INTO housekeepers (name) VALUES 
  ('Мария'),
  ('Елена'),
  ('Ольга'),
  ('Анна')
ON CONFLICT (name) DO NOTHING;