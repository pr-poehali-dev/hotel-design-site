-- Создать уникальный индекс для календаря, чтобы избежать дубликатов
CREATE UNIQUE INDEX IF NOT EXISTS idx_calendar_bnovo_unique 
ON t_p9202093_hotel_design_site.calendar_bnovo (apartment_id, date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_availability_calendar_unique 
ON t_p9202093_hotel_design_site.availability_calendar (room_id, date);