-- Fix password hash for apartment 1401 owner - correct SHA256 hash
UPDATE t_p9202093_hotel_design_site.owner_users 
SET password_hash = 'b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb49fc595a9abb'
WHERE id = 5;