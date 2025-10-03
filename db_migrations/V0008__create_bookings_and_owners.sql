-- Create bookings table for all apartments
CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    apartment_id TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    early_check_in DECIMAL(10, 2) DEFAULT 0,
    late_check_out DECIMAL(10, 2) DEFAULT 0,
    parking DECIMAL(10, 2) DEFAULT 0,
    accommodation_amount DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    aggregator_commission DECIMAL(5, 2) DEFAULT 0,
    tax_and_bank_commission DECIMAL(10, 2) DEFAULT 0,
    remainder_before_management DECIMAL(10, 2) DEFAULT 0,
    management_commission DECIMAL(10, 2) DEFAULT 0,
    remainder_before_expenses DECIMAL(10, 2) DEFAULT 0,
    operating_expenses DECIMAL(10, 2) DEFAULT 0,
    owner_funds DECIMAL(10, 2) DEFAULT 0,
    payment_to_owner DECIMAL(10, 2) DEFAULT 0,
    payment_date DATE,
    maid DECIMAL(10, 2) DEFAULT 0,
    laundry DECIMAL(10, 2) DEFAULT 0,
    hygiene DECIMAL(10, 2) DEFAULT 0,
    transport DECIMAL(10, 2) DEFAULT 0,
    compliment DECIMAL(10, 2) DEFAULT 0,
    other DECIMAL(10, 2) DEFAULT 0,
    other_note TEXT,
    guest_name TEXT,
    guest_email TEXT,
    guest_phone TEXT,
    show_to_guest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries by apartment
CREATE INDEX IF NOT EXISTS idx_bookings_apartment ON bookings(apartment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);

-- Create owners table for apartment ownership
CREATE TABLE IF NOT EXISTS apartment_owners (
    id SERIAL PRIMARY KEY,
    apartment_id TEXT NOT NULL UNIQUE,
    owner_email TEXT NOT NULL,
    owner_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default apartment-owner mappings (you can update these later)
INSERT INTO apartment_owners (apartment_id, owner_email, owner_name) VALUES
    ('2019', 'owner2019@example.com', 'Собственник 2019'),
    ('2119', 'owner2119@example.com', 'Собственник 2119'),
    ('2817', 'owner2817@example.com', 'Собственник 2817'),
    ('1116', 'owner1116@example.com', 'Собственник 1116'),
    ('1522', 'owner1522@example.com', 'Собственник 1522'),
    ('1401', 'owner1401@example.com', 'Собственник 1401'),
    ('2111', 'owner2111@example.com', 'Собственник 2111'),
    ('2110', 'owner2110@example.com', 'Собственник 2110'),
    ('1311', 'owner1311@example.com', 'Собственник 1311'),
    ('906', 'owner906@example.com', 'Собственник 906'),
    ('816', 'owner816@example.com', 'Собственник 816')
ON CONFLICT (apartment_id) DO NOTHING;