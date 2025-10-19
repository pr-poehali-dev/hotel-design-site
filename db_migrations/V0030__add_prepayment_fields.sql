-- Добавление полей для отслеживания предоплаты
ALTER TABLE t_p9202093_hotel_design_site.bookings 
ADD COLUMN IF NOT EXISTS prepayment_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS prepayment_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_prepaid BOOLEAN DEFAULT false;