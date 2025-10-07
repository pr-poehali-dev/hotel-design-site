-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS t_p9202093_hotel_design_site.password_reset_tokens (
    id SERIAL PRIMARY KEY,
    guest_user_id INTEGER NOT NULL REFERENCES t_p9202093_hotel_design_site.guest_users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster token lookup
CREATE INDEX idx_password_reset_tokens_token ON t_p9202093_hotel_design_site.password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user ON t_p9202093_hotel_design_site.password_reset_tokens(guest_user_id);