-- Fix demo guest booking dates to 06.10.2025 - 07.10.2025
UPDATE t_p9202093_hotel_design_site.bookings 
SET 
  check_in = '2025-10-06',
  check_out = '2025-10-07',
  updated_at = NOW()
WHERE guest_email = 'bibliotea@mail.ru' AND id = '1759914826226.323000';