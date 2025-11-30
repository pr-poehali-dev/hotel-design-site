-- Add calendar availability for Bearbrick Studio apartment (90 days forward)
INSERT INTO t_p9202093_hotel_design_site.availability_calendar (room_id, date, is_available, price)
SELECT 
    '1759775530117' as room_id,
    (CURRENT_DATE + interval '1 day' * generate_series)::date as date,
    true as is_available,
    22000 as price
FROM generate_series(0, 89) as generate_series
ON CONFLICT (room_id, date) DO UPDATE SET
    price = EXCLUDED.price;
