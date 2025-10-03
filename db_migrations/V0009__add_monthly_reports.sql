-- Create monthly reports archive table
CREATE TABLE IF NOT EXISTS monthly_reports (
    id SERIAL PRIMARY KEY,
    apartment_id TEXT NOT NULL,
    report_month TEXT NOT NULL, -- Format: 'YYYY-MM' (e.g., '2024-10')
    report_data JSONB NOT NULL, -- Full snapshot of bookings for that month
    total_amount DECIMAL(10, 2) DEFAULT 0,
    owner_funds DECIMAL(10, 2) DEFAULT 0,
    operating_expenses DECIMAL(10, 2) DEFAULT 0,
    bookings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(apartment_id, report_month)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_monthly_reports_apartment ON monthly_reports(apartment_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_month ON monthly_reports(report_month);
