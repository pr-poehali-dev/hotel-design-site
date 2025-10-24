-- Mark duplicate guests by updating their email with _dup suffix and notes
UPDATE t_p9202093_hotel_design_site.guests g1
SET 
    email = CASE 
        WHEN email LIKE '%@%' THEN regexp_replace(email, '@', '_dup' || g1.id || '@', 'g')
        ELSE email || '_dup' || g1.id
    END,
    notes = '[ДУБЛИКАТ] Объединен с гостем ID=' || (
        SELECT MIN(g2.id)::text
        FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
    ) || '. ' || COALESCE(notes, '')
WHERE g1.id != (
    SELECT MIN(g2.id)
    FROM t_p9202093_hotel_design_site.guests g2
    WHERE regexp_replace(g2.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
)
AND EXISTS (
    SELECT 1 
    FROM t_p9202093_hotel_design_site.guests g3
    WHERE regexp_replace(g3.phone, '[^0-9]', '', 'g') = regexp_replace(g1.phone, '[^0-9]', '', 'g')
    AND g3.id != g1.id
);