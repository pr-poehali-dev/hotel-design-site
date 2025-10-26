-- Change scratch_cards.guest_id from uuid to integer to match guests.id
ALTER TABLE t_p9202093_hotel_design_site.scratch_cards 
ALTER COLUMN guest_id TYPE integer USING guest_id::text::integer;