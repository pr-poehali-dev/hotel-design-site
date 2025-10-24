-- Add login for existing guests without login
UPDATE t_p9202093_hotel_design_site.guests 
SET login = COALESCE(NULLIF(email, ''), phone)
WHERE login IS NULL;