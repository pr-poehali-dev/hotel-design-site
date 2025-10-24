-- Create guests table for admin panel
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    is_vip BOOLEAN DEFAULT FALSE,
    bookings_count INTEGER DEFAULT 0,
    total_revenue DECIMAL(10, 2) DEFAULT 0.00,
    last_visit TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);

-- Create index on is_vip for filtering
CREATE INDEX IF NOT EXISTS idx_guests_is_vip ON guests(is_vip);

-- Insert sample data
INSERT INTO guests (name, email, phone, is_vip, bookings_count, total_revenue, last_visit, notes) VALUES
('Александр Петров', 'alex@example.com', '+7 (999) 123-45-67', TRUE, 15, 450000.00, '2024-10-15', 'Постоянный клиент, предпочитает апартаменты с видом на парк'),
('Мария Иванова', 'maria@example.com', '+7 (999) 234-56-78', FALSE, 3, 75000.00, '2024-09-20', ''),
('Дмитрий Соколов', 'dmitry@example.com', '+7 (999) 345-67-89', TRUE, 22, 890000.00, '2024-10-22', 'VIP клиент, всегда заказывает дополнительные услуги'),
('Елена Смирнова', 'elena@example.com', '+7 (999) 456-78-90', FALSE, 1, 25000.00, '2024-08-10', '');