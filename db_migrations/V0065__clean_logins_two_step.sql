-- Step 1: Add temporary unique suffix to all logins to avoid conflicts
UPDATE t_p9202093_hotel_design_site.guests 
SET login = login || '__temp__' || id
WHERE login IS NOT NULL;

-- Step 2: Clean logins and add _id suffix only to duplicates
UPDATE t_p9202093_hotel_design_site.guests g1
SET login = CASE
    WHEN EXISTS (
        SELECT 1 FROM t_p9202093_hotel_design_site.guests g2
        WHERE regexp_replace(regexp_replace(g2.login, '__temp__[0-9]+$', ''), '[^0-9a-zA-Z@._]', '', 'g') = 
              regexp_replace(regexp_replace(g1.login, '__temp__[0-9]+$', ''), '[^0-9a-zA-Z@._]', '', 'g')
        AND g2.id < g1.id
    ) THEN regexp_replace(regexp_replace(g1.login, '__temp__[0-9]+$', ''), '[^0-9a-zA-Z@._]', '', 'g') || '_' || g1.id
    ELSE regexp_replace(regexp_replace(g1.login, '__temp__[0-9]+$', ''), '[^0-9a-zA-Z@._]', '', 'g')
END
WHERE login IS NOT NULL;