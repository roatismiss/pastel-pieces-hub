-- First, create profiles for any users who have community posts but no profile
INSERT INTO profiles (user_id, full_name)
SELECT DISTINCT cp.user_id, 'User' as full_name
FROM community_posts cp
LEFT JOIN profiles p ON cp.user_id = p.user_id
WHERE p.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Now add the foreign key relationship from community_posts to profiles
ALTER TABLE community_posts 
ADD CONSTRAINT fk_community_posts_user_id 
FOREIGN KEY (user_id) 
REFERENCES profiles(user_id) 
ON DELETE CASCADE;