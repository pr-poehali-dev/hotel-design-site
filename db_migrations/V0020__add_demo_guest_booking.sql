-- Add booking for demo guest (bibliotea@mail.ru) for apartment 2119
INSERT INTO t_p9202093_hotel_design_site.bookings 
(
  id, 
  apartment_id, 
  check_in, 
  check_out, 
  accommodation_amount,
  total_amount,
  guest_name, 
  guest_email, 
  guest_phone, 
  guest_user_id,
  show_to_guest, 
  created_at
)
VALUES 
(
  (EXTRACT(EPOCH FROM NOW()) * 1000)::TEXT,
  '2119',
  '2025-10-15',
  '2025-10-20',
  50000,
  50000,
  'demo',
  'bibliotea@mail.ru',
  '89104676860',
  2,
  true,
  NOW()
);