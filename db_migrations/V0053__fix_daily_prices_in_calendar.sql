-- Исправляем неправильные цены в availability_calendar
-- Цена должна быть общей суммой, разделенной на количество дней (не на каждый день полностью)

UPDATE t_p9202093_hotel_design_site.availability_calendar ac
SET price = (
    SELECT b.total_amount / NULLIF((b.check_out::date - b.check_in::date), 0)
    FROM t_p9202093_hotel_design_site.bookings b
    WHERE b.id = ac.booking_id
)
WHERE ac.booking_id IS NOT NULL;