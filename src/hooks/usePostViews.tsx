import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const usePostViews = () => {
  const { user } = useAuth();

  const trackPostView = useCallback(async (postId: string, postType: 'post' | 'event') => {
    if (!postId) return;

    try {
      if (postType === 'post') {
        // Get current view count and increment
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
        // Get current view count and increment
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
      
      console.log(`Tracked view for ${postType}: ${postId}`);
    } catch (error) {
      console.error('Error tracking post view:', error);
      // Don't show error to user as this is background tracking
    }
  }, []);

  return { trackPostView };
};