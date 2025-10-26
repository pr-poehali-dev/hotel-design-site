-- Change fortune_wheel_bonus_spins.guest_id from uuid to integer to match guests.id
ALTER TABLE t_p9202093_hotel_design_site.fortune_wheel_bonus_spins 
ALTER COLUMN guest_id TYPE integer USING guest_id::text::integer;