-- Добавляем записи в availability_calendar для всех существующих бронирований из Bnovo
-- которые ещё не добавлены в календарь

INSERT INTO t_p9202093_hotel_design_site.availability_calendar (room_id, date, is_available, booking_id, price)
SELECT 
    r.id as room_id,
    d.date,
    false as is_available,
    b.id as booking_id,
    COALESCE(b.total_amount / NULLIF(b.check_out::date - b.check_in::date, 0), 0) as price
FROM t_p9202093_hotel_design_site.bookings b
JOIN t_p9202093_hotel_design_site.rooms r ON b.apartment_id = r.number
CROSS JOIN LATERAL generate_series(b.check_in::date, b.check_out::date - interval '1 day', interval '1 day') AS d(date)
WHERE b.source = 'bnovo'
  AND NOT EXISTS (
    SELECT 1 FROM t_p9202093_hotel_design_site.availability_calendar ac
    WHERE ac.room_id = r.id AND ac.date = d.date AND ac.booking_id = b.id
  )
ON CONFLICT (room_id, date) DO UPDATE SET
    is_available = EXCLUDED.is_available,
    booking_id = EXCLUDED.booking_id,
    price = EXCLUDED.price;