-- Update owner_funds for existing bookings where it's 0 or NULL
-- Calculating as 80% of total_amount (assuming 20% service fee)
UPDATE t_p9202093_hotel_design_site.bookings 
SET owner_funds = total_amount * 0.8 
WHERE (owner_funds = 0 OR owner_funds IS NULL) 
  AND total_amount > 0;