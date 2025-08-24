-- First, delete therapists without real user connections to clean up data
DELETE FROM public.therapists WHERE user_id IS NULL;

-- Enable realtime for community tables
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.community_comments REPLICA IDENTITY FULL;
ALTER TABLE public.therapist_posts REPLICA IDENTITY FULL;

-- Add tables to realtime publication (will ignore if already exists)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.community_comments;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.therapist_posts;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END
$$;

-- Add triggers for updated_at columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_posts_updated_at') THEN
        CREATE TRIGGER update_community_posts_updated_at
        BEFORE UPDATE ON public.community_posts
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_comments_updated_at') THEN
        CREATE TRIGGER update_community_comments_updated_at
        BEFORE UPDATE ON public.community_comments
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END
$$;

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
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_comment_count_insert') THEN
        CREATE TRIGGER trigger_update_comment_count_insert
        AFTER INSERT ON public.community_comments
        FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_update_comment_count_delete') THEN
        CREATE TRIGGER trigger_update_comment_count_delete
        AFTER DELETE ON public.community_comments
        FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();
    END IF;
END
$$;