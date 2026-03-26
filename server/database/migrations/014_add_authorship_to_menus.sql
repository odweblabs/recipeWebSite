-- Add authorship and approval fields to menus table
ALTER TABLE menus ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE menus ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Set existing official menus to be approved and authored by 'Tarifo'
UPDATE menus SET is_approved = TRUE, author_name = 'Tarifo' WHERE is_preset = TRUE;
