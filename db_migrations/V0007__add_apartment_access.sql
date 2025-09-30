ALTER TABLE report_users 
ADD COLUMN apartment_numbers TEXT[];

COMMENT ON COLUMN report_users.apartment_numbers IS 'Массив номеров апартаментов, к которым имеет доступ пользователь';