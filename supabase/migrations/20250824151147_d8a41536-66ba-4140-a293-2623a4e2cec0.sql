-- Fix RLS policy for therapist posts
-- Drop the incorrect policy
DROP POLICY IF EXISTS "Therapists can manage their own posts" ON therapist_posts;

-- Create the correct policy that links user_id through therapists table
CREATE POLICY "Therapists can manage their own posts" 
ON therapist_posts 
FOR ALL
USING (
  auth.uid() IN (
    SELECT t.user_id 
    FROM therapists t 
    WHERE t.id = therapist_posts.therapist_id
  )
) 
WITH CHECK (
  auth.uid() IN (
    SELECT t.user_id 
    FROM therapists t 
    WHERE t.id = therapist_posts.therapist_id
  )
);