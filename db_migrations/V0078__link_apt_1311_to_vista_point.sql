-- Обновляем бронирования apt-1311 на правильный ID Vista Point
UPDATE t_p9202093_hotel_design_site.bookings
SET apartment_id = '1759775039895'
WHERE apartment_id = 'apt-1311';