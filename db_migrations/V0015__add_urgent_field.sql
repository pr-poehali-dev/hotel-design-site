-- Добавляем поле urgent (срочность)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS urgent BOOLEAN DEFAULT false;