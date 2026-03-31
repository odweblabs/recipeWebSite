-- 016_add_performance_indexes.sql

-- Recipes Table
CREATE INDEX IF NOT EXISTS idx_recipes_category_id ON recipes(category_id);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);

-- Comments Table
CREATE INDEX IF NOT EXISTS idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- Ratings Table
CREATE INDEX IF NOT EXISTS idx_ratings_recipe_id ON ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);

-- Favorites Table
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Menu Recipes Table
CREATE INDEX IF NOT EXISTS idx_menu_recipes_recipe_id ON menu_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_menu_recipes_menu_id ON menu_recipes(menu_id);

-- Notifications Table
CREATE INDEX IF NOT EXISTS idx_notifications_related_id ON notifications(related_id);

-- Users Table (Searching for usernames and titles)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
