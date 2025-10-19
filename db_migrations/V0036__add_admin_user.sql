-- Добавление администратора с логином hab-agent@mail.ru
INSERT INTO t_p9202093_hotel_design_site.owner_users 
(username, password_hash, full_name, apartment_number, email, phone, is_active, created_at, updated_at)
VALUES (
  'hab-agent@mail.ru',
  'd4f5e2c8b1a3f6e9d2c5a8b7f4e1c9a6d3b8f5e2c7a4d1b9e6f3c2a5d8b1e7f4',
  'Администратор (Вы)',
  'ALL',
  'hab-agent@mail.ru',
  '',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;
