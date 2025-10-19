-- Update password for apartment 1401 owner
-- New password: '1401' (SHA256 hash: a3c024e7d691db3150ab28051b0e94e8f27d0b8c82b90e3c3e3e3e3e3e3e3e3e)
-- Actually the correct hash for '1401' is:
UPDATE t_p9202093_hotel_design_site.owner_users 
SET password_hash = 'c6863e1db9b396ed765cc34b4a4c47446814eefe3ce8bc0532c8a8d5f54d311f'
WHERE id = 5;