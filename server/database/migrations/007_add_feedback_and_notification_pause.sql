-- 007_add_feedback_and_notification_pause.sql

-- Add notifications_paused to users table
ALTER TABLE users ADD COLUMN notifications_paused BOOLEAN DEFAULT FALSE;

-- Create feedback table for suggestions and bug reports
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- 'suggestion' or 'bug_report'
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
