-- Добавляем поле email для горничных
ALTER TABLE housekeepers ADD COLUMN email VARCHAR(255) UNIQUE;