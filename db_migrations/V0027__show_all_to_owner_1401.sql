-- Update show_to_guest for all bookings in apartment 1401
UPDATE bookings SET show_to_guest = true WHERE apartment_id = '1401' AND show_to_guest = false;