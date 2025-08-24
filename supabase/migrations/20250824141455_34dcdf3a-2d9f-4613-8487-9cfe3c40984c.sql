-- Fix user_id to be required in therapists table
ALTER TABLE public.therapists 
ALTER COLUMN user_id SET NOT NULL;

-- Update existing therapists to have proper user_id connections
-- First, let's create some test user connections for existing therapist applications
UPDATE public.therapists 
SET user_id = (
  SELECT user_id 
  FROM public.therapist_applications 
  WHERE therapist_applications.id = therapists.application_id
  LIMIT 1
)
WHERE user_id IS NULL AND application_id IS NOT NULL;

-- Enable realtime for community tables
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;
ALTER TABLE public.therapist_posts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments; 
ALTER PUBLICATION supabase_realtime ADD TABLE public.therapist_posts;

-- Add triggers for updated_at columns
CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
BEFORE UPDATE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically update comment_count in community_posts
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts 
    SET comment_count = comment_count - 1 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comment count updates
CREATE TRIGGER trigger_update_comment_count_insert
AFTER INSERT ON public.community_comments
FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();

CREATE TRIGGER trigger_update_comment_count_delete
AFTER DELETE ON public.community_comments
FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();