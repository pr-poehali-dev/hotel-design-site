-- Create table for storing fortune wheel spins
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.fortune_wheel_spins (
    id SERIAL PRIMARY KEY,
    guest_email VARCHAR(255) NOT NULL,
    guest_name VARCHAR(255),
    booking_id INTEGER,
    discount_percent INTEGER NOT NULL CHECK (discount_percent IN (5, 10, 15, 20, 25, 30, 40, 50)),
    promo_code VARCHAR(50) NOT NULL UNIQUE,
    spin_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used BOOLEAN DEFAULT FALSE,
    used_date TIMESTAMP,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups by email
CREATE INDEX idx_fortune_spins_email ON t_p9202093_hotel_design_site.fortune_wheel_spins(guest_email);

-- Create index for faster lookups by promo code
CREATE INDEX idx_fortune_spins_promo ON t_p9202093_hotel_design_site.fortune_wheel_spins(promo_code);

-- Create index for checking booking_id to prevent multiple spins per booking
CREATE INDEX idx_fortune_spins_booking ON t_p9202093_hotel_design_site.fortune_wheel_spins(booking_id);
