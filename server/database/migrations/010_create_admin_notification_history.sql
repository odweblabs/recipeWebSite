-- 010_create_admin_notification_history.sql
CREATE TABLE IF NOT EXISTS admin_notification_history (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- 'all' or 'specific'
    recipient_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_admin_notif_history_sender_id ON admin_notification_history(sender_id);
