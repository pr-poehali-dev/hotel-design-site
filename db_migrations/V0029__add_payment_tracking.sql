-- Add payment tracking fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMP;