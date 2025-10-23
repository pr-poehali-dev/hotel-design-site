-- Добавляем новые поля для управления гостями
ALTER TABLE t_p9202093_hotel_design_site.guest_users
ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS guest_type VARCHAR(50) DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS assigned_apartments JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS promo_codes JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_bookings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent NUMERIC(10,2) DEFAULT 0;

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_guest_users_username ON t_p9202093_hotel_design_site.guest_users(username);
CREATE INDEX IF NOT EXISTS idx_guest_users_email ON t_p9202093_hotel_design_site.guest_users(email);
CREATE INDEX IF NOT EXISTS idx_guest_users_status ON t_p9202093_hotel_design_site.guest_users(status);
CREATE INDEX IF NOT EXISTS idx_guest_users_guest_type ON t_p9202093_hotel_design_site.guest_users(guest_type);

COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.username IS 'Логин для входа (видимый админу)';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.status IS 'Статус: active, blocked, vip';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.guest_type IS 'Тип: regular, vip, corporate, blacklist';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.assigned_apartments IS 'Назначенные категории апартаментов (справочно для админа)';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.admin_notes IS 'Внутренние заметки админа о госте';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.promo_codes IS 'Персональные промокоды гостя';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.total_bookings IS 'Общее количество броней';
COMMENT ON COLUMN t_p9202093_hotel_design_site.guest_users.total_spent IS 'Общая сумма потраченных средств';