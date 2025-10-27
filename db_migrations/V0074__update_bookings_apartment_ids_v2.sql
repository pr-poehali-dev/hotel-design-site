-- Обновляем apartment_id в бронированиях, используя маппинг через bnovo_id
UPDATE t_p9202093_hotel_design_site.bookings b
SET apartment_id = r.id
FROM t_p9202093_hotel_design_site.rooms r
WHERE b.apartment_id = CAST(r.bnovo_id AS TEXT)
  AND r.bnovo_id IS NOT NULL;