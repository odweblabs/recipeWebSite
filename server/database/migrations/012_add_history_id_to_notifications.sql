-- 012_add_history_id_to_notifications.sql
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS history_id INTEGER REFERENCES admin_notification_history(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_history_id ON notifications(history_id);
