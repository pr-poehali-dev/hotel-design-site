-- Сделать все бронирования из Bnovo видимыми для инвесторов
UPDATE t_p9202093_hotel_design_site.bookings 
SET show_to_guest = true 
WHERE source = 'bnovo' 
  AND status = 'confirmed' 
  AND show_to_guest = false;