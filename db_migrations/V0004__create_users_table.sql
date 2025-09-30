-- Создание таблицы пользователей для доступа к отчетам
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индекса для быстрого поиска по username
CREATE INDEX idx_users_username ON users(username);

-- Добавление стандартного пользователя admin с паролем admin123
-- Хэш пароля (простая реализация для примера)
INSERT INTO users (username, password_hash, full_name) 
VALUES ('admin', 'admin123', 'Администратор');

-- Комментарии к таблице
COMMENT ON TABLE users IS 'Пользователи системы отчетов';
COMMENT ON COLUMN users.username IS 'Логин пользователя (уникальный)';
COMMENT ON COLUMN users.password_hash IS 'Хэш пароля пользователя';
COMMENT ON COLUMN users.is_active IS 'Статус активности пользователя';