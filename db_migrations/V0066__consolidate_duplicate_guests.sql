-- Consolidate duplicate guest data: merge VIP status, bonus points, notes
-- Update only the oldest record (minimum ID) for each phone group
UPDATE t_p9202093_hotel_design_site.guests g1
SET 
    is_vip = (
        SELECT bool_or(g2.is_vip) 
        FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
    ),
    bonus_points = (
        SELECT COALESCE(SUM(g2.bonus_points), 0)
        FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
    ),
    notes = COALESCE((
        SELECT string_agg(g2.notes, '; ')
        FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
        AND g2.notes != ''
    ), ''),
    name = COALESCE((
        SELECT g2.name 
        FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
        AND g2.name NOT LIKE '%—%'
        AND g2.name NOT LIKE '%Пользователь%'
        ORDER BY g2.id
        LIMIT 1
    ), g1.name)
WHERE g1.id = (
    SELECT MIN(g2.id)
    FROM t_p9202093_hotel_design_site.guests g2
    WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
    GROUP BY regexp_replace(g2.phone, '[^0-9]', '', 'g')
    HAVING COUNT(*) > 1
);