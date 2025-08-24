import React from 'react';
import { useParams } from 'react-router-dom';
import { useProfileViews } from '@/hooks/useProfileViews';
import EnhancedTherapistProfile from '@/components/therapist/EnhancedTherapistProfile';

const TherapistProfile = () => {
  const { id } = useParams();
  
  // Track profile view
  useProfileViews(id || '');
  
  return <EnhancedTherapistProfile />;
};

export default TherapistProfile;