-- 003_site_settings.sql
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial empty recommendation if not exists
INSERT INTO site_settings (key, value) VALUES ('chef_recommendation_id', '') ON CONFLICT (key) DO NOTHING;
