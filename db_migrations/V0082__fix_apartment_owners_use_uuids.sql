-- Обновляем apartment_owners, чтобы использовать UUID вместо номеров
UPDATE t_p9202093_hotel_design_site.apartment_owners ao
SET apartment_id = r.id
FROM t_p9202093_hotel_design_site.rooms r
WHERE ao.apartment_id = r.number
  AND r.number NOT LIKE 'OLD-%';