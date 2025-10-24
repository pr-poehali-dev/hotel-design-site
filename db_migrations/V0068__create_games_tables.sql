-- Create table for storing fortune wheel spins with bonus points
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.fortune_wheel_bonus_spins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL,
    bonus_points INTEGER NOT NULL CHECK (bonus_points IN (500, 1000, 5000, 10000)),
    spin_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    next_spin_available TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create table for scratch cards
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.scratch_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL,
    booking_id UUID NOT NULL,
    bonus_points INTEGER NOT NULL CHECK (bonus_points IN (0, 1000, 2000, 3000, 5000)),
    is_scratched BOOLEAN DEFAULT FALSE,
    scratched_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (booking_id)
);

-- Create indexes
CREATE INDEX idx_fortune_bonus_guest ON t_p9202093_hotel_design_site.fortune_wheel_bonus_spins(guest_id);
CREATE INDEX idx_scratch_guest ON t_p9202093_hotel_design_site.scratch_cards(guest_id);
CREATE INDEX idx_scratch_booking ON t_p9202093_hotel_design_site.scratch_cards(booking_id);