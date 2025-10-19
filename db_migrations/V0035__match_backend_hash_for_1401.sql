-- Set password hash to match what backend function generates for '1401'
UPDATE t_p9202093_hotel_design_site.owner_users 
SET password_hash = 'afd679cd3f9a81fd9ce02e6434a24f848937f09909fabcc3b3781e06036e284c'
WHERE id = 5;