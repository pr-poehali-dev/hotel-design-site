-- Связываем комнаты с префиксом apt- с их BНОВО ID
UPDATE t_p9202093_hotel_design_site.rooms
SET bnovo_id = CAST(SUBSTRING(id FROM 5) AS INTEGER)
WHERE id LIKE 'apt-%'
  AND bnovo_id IS NULL;