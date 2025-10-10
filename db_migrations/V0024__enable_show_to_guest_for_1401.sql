-- Enable show_to_guest for apartment 1401 bookings
UPDATE t_p9202093_hotel_design_site.bookings 
SET show_to_guest = true, updated_at = NOW()
WHERE apartment_id = '1401' AND show_to_guest = false;