-- Create test hidden booking for apartment 1401
INSERT INTO bookings (
    id, apartment_id, check_in, check_out, accommodation_amount, total_amount, show_to_guest, created_at
) VALUES (
    'test-hidden-booking-1401', '1401', '2025-10-20', '2025-10-22', 50000, 50000, false, CURRENT_TIMESTAMP
);