-- Создание таблицы пользователей для доступа к отчетам
CREATE TABLE report_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role VARCHAR(50) DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление администратора по умолчанию
INSERT INTO report_users (username, password, full_name, role) 
VALUES ('admin', 'admin123', 'Администратор', 'admin');

-- Индексы
CREATE INDEX idx_report_users_username ON report_users(username);
CREATE INDEX idx_report_users_active ON report_users(is_active);

-- Комментарии
COMMENT ON TABLE report_users IS 'Пользователи для доступа к отчетам собственников';
COMMENT ON COLUMN report_users.username IS 'Логин пользователя';
COMMENT ON COLUMN report_users.password IS 'Пароль (хранится в открытом виде для простоты)';
COMMENT ON COLUMN report_users.role IS 'Роль: admin (полный доступ) или viewer (только просмотр)';