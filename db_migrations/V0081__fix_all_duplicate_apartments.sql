-- Переносим бронирования на настоящие апартаменты
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759775593604' WHERE apartment_id = 'apt-1116';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1761554411765' WHERE apartment_id = 'apt-2019';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759774533761' WHERE apartment_id = 'apt-2110';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759773745026' WHERE apartment_id = 'apt-2111';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759775530117' WHERE apartment_id = 'apt-2119';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759775450678' WHERE apartment_id = 'apt-2817';
UPDATE t_p9202093_hotel_design_site.bookings SET apartment_id = '1759775297513' WHERE apartment_id = 'apt-906';

-- Деактивируем все дубликаты
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-1116' WHERE id = 'apt-1116';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-2019' WHERE id = 'apt-2019';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-2110' WHERE id = 'apt-2110';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-2111' WHERE id = 'apt-2111';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-2119' WHERE id = 'apt-2119';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-2817' WHERE id = 'apt-2817';
UPDATE t_p9202093_hotel_design_site.rooms SET bnovo_id = NULL, number = 'OLD-906' WHERE id = 'apt-906';