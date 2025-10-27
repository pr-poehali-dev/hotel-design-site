-- Исправляем email владельца апартамента 1401
UPDATE t_p9202093_hotel_design_site.apartment_owners
SET owner_email = 'sss89037323566@yandex.ru'
WHERE apartment_id = '1759774889950' AND owner_email = 'sss89037323566';