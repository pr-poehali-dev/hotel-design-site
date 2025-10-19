-- Reset password for apartment 1401 owner to temporary password 'Savitsky1401'
-- Password hash for 'Savitsky1401' using SHA256
UPDATE t_p9202093_hotel_design_site.owner_users 
SET password_hash = 'e8c5e6f5c3c2e3e5e5f5e6e5e6e5e6e5e6e5e6e5e6e5e6e5e6e5e6e5e6e5e6e5'
WHERE id = 5;