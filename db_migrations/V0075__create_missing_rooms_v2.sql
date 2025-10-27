-- Создаем недостающие комнаты для старых бронирований
INSERT INTO t_p9202093_hotel_design_site.rooms (id, bnovo_id, number, floor)
SELECT DISTINCT 'apt-' || b.apartment_id, CAST(b.apartment_id AS INTEGER), b.apartment_id, 1
FROM t_p9202093_hotel_design_site.bookings b
WHERE b.bnovo_id IS NOT NULL
  AND b.apartment_id ~ '^[0-9]+$'
  AND b.apartment_id NOT IN (SELECT id FROM t_p9202093_hotel_design_site.rooms)
  AND CAST(b.apartment_id AS INTEGER) NOT IN (SELECT bnovo_id FROM t_p9202093_hotel_design_site.rooms WHERE bnovo_id IS NOT NULL)
ON CONFLICT (id) DO NOTHING;