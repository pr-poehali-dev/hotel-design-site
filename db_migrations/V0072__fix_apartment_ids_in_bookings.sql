-- Обновляем apartment_id в бронированиях, преобразуя BНОВО ID в внутренние ID
UPDATE t_p9202093_hotel_design_site.bookings b
SET apartment_id = r.id
FROM t_p9202093_hotel_design_site.rooms r
WHERE b.apartment_id = CAST(r.bnovo_id AS TEXT)
  AND r.bnovo_id IS NOT NULL
  AND b.bnovo_id IS NOT NULL;