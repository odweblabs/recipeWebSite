-- 009_add_related_id_to_notifications.sql
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS related_id INTEGER;
