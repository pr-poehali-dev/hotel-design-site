-- Добавление колонки для PDF файлов в инструкции
ALTER TABLE check_in_instructions ADD COLUMN IF NOT EXISTS pdf_files text[];

-- Добавление комментария к колонке
COMMENT ON COLUMN check_in_instructions.pdf_files IS 'Массив URL-ссылок на PDF файлы с инструкциями';