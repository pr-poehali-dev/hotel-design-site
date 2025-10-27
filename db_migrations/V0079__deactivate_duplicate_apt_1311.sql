-- Деактивируем дубликат apt-1311, чтобы CRON использовал только Vista Point
UPDATE t_p9202093_hotel_design_site.rooms 
SET bnovo_id = NULL, number = 'OLD-1311'
WHERE id = 'apt-1311' AND bnovo_id = 1311;