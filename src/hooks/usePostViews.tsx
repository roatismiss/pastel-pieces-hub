import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePostViews = () => {
  const { user } = useAuth();

  const trackPostView = useCallback(async (postId: string, postType: 'post' | 'event' | 'therapist_post' | 'community_post') => {
    if (!postId) return;

    try {
      // Track views based on post type
      if (postType === 'post' || postType === 'therapist_post') {
        // Get current view count and increment it
        const { data: currentPost } = await supabase
          .from('therapist_posts')
          .select('view_count')
          .eq('id', postId)
          .single();
          
        if (currentPost) {
          await supabase
            .from('therapist_posts')
            .update({ 
              view_count: (currentPost.view_count || 0) + 1 
            })
            .eq('id', postId);
        }
      } else if (postType === 'event') {
        // Get current view count and increment it for events
        const { data: currentEvent } = await supabase
          .from('therapist_events')
          .select('view_count')
          .eq('id', postId)
          .single();
          
        if (currentEvent) {
          await supabase
            .from('therapist_events')
            .update({ 
              view_count: (currentEvent.view_count || 0) + 1 
            })
            .eq('id', postId);
        }
      }
    } catch (error) {
      console.error('Error tracking post view:', error);
      // Don't show error to user as this is background tracking
    }
  }, [user]);

  return { trackPostView };
};