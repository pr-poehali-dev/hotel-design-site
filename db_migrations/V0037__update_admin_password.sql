-- Обновление пароля администратора
-- SHA256 hash для пароля: 3Dyzaape29938172
UPDATE t_p9202093_hotel_design_site.owner_users 
SET password_hash = 'f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8'
WHERE username = 'hab-agent@mail.ru';
