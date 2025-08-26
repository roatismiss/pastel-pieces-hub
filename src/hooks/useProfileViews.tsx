import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useProfileViews = (therapistId: string) => {
  const { user } = useAuth();

  const trackView = async () => {
    if (!therapistId) return;

    try {
      // Always insert view record - track every view even from same user
      await supabase
        .from('therapist_profile_views')
        .insert({
          therapist_id: therapistId,
          viewer_id: user?.id || null, // Can be null for anonymous views
        });
    } catch (error) {
      console.error('Error tracking profile view:', error);
      // Don't show error to user as this is background tracking
    }
  };

  useEffect(() => {
    // Track view when component mounts (when profile is visited)
    if (therapistId) {
      trackView();
    }
  }, [therapistId]); // Only track when therapistId changes, not when user changes

  return { trackView };
};