-- Fix Bearbrick Studio apartment number from 2117 to 2119 to match Bnovo
UPDATE t_p9202093_hotel_design_site.rooms 
SET number = '2119', 
    updated_at = NOW()
WHERE id = '1759775530117' AND number = '2117';
