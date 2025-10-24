-- Simplify guest logins: remove +, quotes, parentheses, dashes
UPDATE t_p9202093_hotel_design_site.guests 
SET login = regexp_replace(login, '[^0-9a-zA-Z@._-]', '', 'g')
WHERE login IS NOT NULL;