-- Create guests from existing Bnovo bookings
INSERT INTO t_p9202093_hotel_design_site.guests (name, email, phone, password, bonus_points, is_vip)
SELECT DISTINCT ON (COALESCE(NULLIF(guest_email, ''), guest_phone))
    guest_name,
    COALESCE(NULLIF(guest_email, ''), guest_phone) as email,
    COALESCE(guest_phone, '') as phone,
    substring(md5(random()::text) from 1 for 8) as password,
    0 as bonus_points,
    false as is_vip
FROM t_p9202093_hotel_design_site.bookings
WHERE source = 'bnovo' 
  AND (guest_email IS NOT NULL AND guest_email != '' OR guest_phone IS NOT NULL AND guest_phone != '')
ON CONFLICT (email) DO NOTHING;