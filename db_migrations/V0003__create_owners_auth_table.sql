-- Создание таблицы для авторизации собственников
CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    apartment_number VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Индексы
CREATE INDEX idx_username ON owners(username);
CREATE INDEX idx_apartment_number_owners ON owners(apartment_number);

-- Добавление тестового собственника (пароль: 123456)
-- В реальном проекте пароли должны быть захешированы
INSERT INTO owners (username, password_hash, full_name, apartment_number, email) 
VALUES ('owner816', 'e10adc3949ba59abbe56e057f20f883e', 'Собственник апартамента 816', '816', 'owner816@example.com');

COMMENT ON TABLE owners IS 'Таблица собственников апартаментов для авторизации';