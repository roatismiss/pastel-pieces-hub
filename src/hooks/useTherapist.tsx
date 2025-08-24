import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TherapistApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization: string;
  license_number: string;
  years_experience: number;
  education: string;
  bio?: string;
  certifications?: string[];
  languages: string[];
  license_document_url?: string;
  cv_document_url?: string;
  certificate_urls?: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

interface TherapistProfile {
  id: string;
  name: string;
  specialization: string;
  bio?: string;
  rating: number;
  price: number;
  languages: string[];
  availability: string;
  is_verified: boolean;
  user_id?: string;
  application_id?: string;
}

export const useTherapist = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<TherapistApplication | null>(null);
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile | null>(null);
  const [isTherapist, setIsTherapist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTherapistStatus = async () => {
      if (!user) {
        setApplication(null);
        setTherapistProfile(null);
        setIsTherapist(false);
        setLoading(false);
        return;
      }

      try {
        // Check for existing application
        const { data: applicationData, error: appError } = await supabase
          .from('therapist_applications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (appError && appError.code !== 'PGRST116') {
          console.error('Error checking therapist application:', appError);
        }

        setApplication(applicationData as TherapistApplication);

        // Check for therapist profile
        const { data: profileData, error: profileError } = await supabase
          .from('therapists')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking therapist profile:', profileError);
        }

        setTherapistProfile(profileData);
        setIsTherapist(!!profileData);
      } catch (error) {
        console.error('Error checking therapist status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTherapistStatus();
  }, [user]);

  const submitApplication = async (applicationData: Omit<TherapistApplication, 'id' | 'user_id' | 'status' | 'applied_at' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('therapist_applications')
      .insert({
        ...applicationData,
        user_id: user.id,
        email: user.email || applicationData.email,
      })
      .select()
      .single();

    if (error) throw error;

    setApplication(data as TherapistApplication);
    return data;
  };

  const updateApplication = async (updates: Partial<TherapistApplication>) => {
    if (!user || !application) throw new Error('No application to update');

    const { data, error } = await supabase
      .from('therapist_applications')
      .update(updates)
      .eq('id', application.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    setApplication(data as TherapistApplication);
    return data;
  };

  const hasApplication = !!application;
  const applicationStatus = application?.status;
  const canApply = !hasApplication && !isTherapist;
  const canEditApplication = hasApplication && applicationStatus === 'pending';

  return {
    application,
    therapistProfile,
    isTherapist,
    loading,
    hasApplication,
    applicationStatus,
    canApply,
    canEditApplication,
    submitApplication,
    updateApplication,
  };
};