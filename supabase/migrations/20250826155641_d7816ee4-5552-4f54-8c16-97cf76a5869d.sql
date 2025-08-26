-- Fix the relationship between community_posts and profiles
-- Since community_posts.user_id references auth.users.id, we need to update it to reference profiles.user_id instead

-- First, let's make sure we have the correct relationship
-- The community_posts.user_id should reference profiles.user_id (which references auth.users.id)

-- Add a foreign key relationship from community_posts to profiles
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_user_id 
FOREIGN KEY (user_id) 
REFERENCES profiles(user_id) 
ON DELETE CASCADE;