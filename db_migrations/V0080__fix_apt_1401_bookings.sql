-- Переносим бронирования с apt-1401 на настоящий Mirror Studio (1759774889950)
UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = '1759774889950'
WHERE apartment_id = 'apt-1401';

-- Деактивируем дубликат apt-1401
UPDATE t_p9202093_hotel_design_site.rooms 
SET bnovo_id = NULL, number = 'OLD-1401'
WHERE id = 'apt-1401' AND bnovo_id = 1401;