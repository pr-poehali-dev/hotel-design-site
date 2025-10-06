-- Добавление полей для авторизации в таблицу housekeepers
ALTER TABLE housekeepers ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE housekeepers ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'housekeeper';

-- Обновление существующих записей
UPDATE housekeepers SET password = '89261781426' WHERE email = 'savasteeva020202@yandex.ru';
UPDATE housekeepers SET role = 'housekeeper' WHERE role IS NULL;

-- Вставка админа если его еще нет
INSERT INTO housekeepers (name, email, password, role)
VALUES ('Администратор', 'hab-agent@mail.ru', '3Dyzaape29938172', 'admin')
ON CONFLICT DO NOTHING;