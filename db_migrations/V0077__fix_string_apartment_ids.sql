-- Обновляем бронирования со строковыми apartment_id
UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = 'apt-1157'
WHERE apartment_id = 'Мат Поинт 1157';

UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = 'apt-193'
WHERE apartment_id = 'Энитэо-193';

UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = '1759775640034'
WHERE apartment_id = 'Поклонная 9-816';

UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = 'apt-1157'
WHERE apartment_id = 'Апартамент студия Матч Поинт';