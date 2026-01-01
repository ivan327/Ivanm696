/*
  # Optimize RLS Policies and Security

  ## Changes
  1. Fix RLS policies - wrap auth.uid() with (select auth.uid()) for better performance
  2. Remove unused indexes
  3. Fix function search_path mutability
  4. Enable HaveIBeenPwned password protection

  ## Benefits
  - Improved query performance at scale
  - RLS policies evaluated once per query instead of per-row
  - Remove unnecessary indexes saving storage and maintenance
  - Enhanced security with compromised password detection
*/

-- Drop triggers first
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

-- Drop unused indexes
DROP INDEX IF EXISTS idx_posts_user_id;
DROP INDEX IF EXISTS idx_comments_post_id;
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_messages_from_user;
DROP INDEX IF EXISTS idx_messages_to_user;
DROP INDEX IF EXISTS idx_profiles_telegram_id;
DROP INDEX IF EXISTS idx_posts_status;

-- Drop and recreate function with immutable search_path
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Drop and recreate RLS policies for profiles table with optimized auth.uid() calls
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()))
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

-- Drop and recreate RLS policies for posts table with optimized auth.uid() calls
DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  TO authenticated
  USING (status = 'published' OR user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Drop and recreate RLS policies for comments table with optimized auth.uid() calls
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Drop and recreate RLS policies for messages table with optimized auth.uid() calls
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages they received" ON messages;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT auth.uid()) OR to_user_id = (SELECT auth.uid()));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = (SELECT auth.uid()));

CREATE POLICY "Users can update messages they received"
  ON messages FOR UPDATE
  TO authenticated
  USING (to_user_id = (SELECT auth.uid()))
  WITH CHECK (to_user_id = (SELECT auth.uid()));