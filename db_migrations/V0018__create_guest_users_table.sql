-- Create guest_users table for email/password authentication
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.guest_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_guest_users_email ON t_p9202093_hotel_design_site.guest_users(email);

-- Link bookings to guest_users
ALTER TABLE t_p9202093_hotel_design_site.bookings 
ADD COLUMN IF NOT EXISTS guest_user_id INTEGER REFERENCES t_p9202093_hotel_design_site.guest_users(id);