-- Create therapist posts table
CREATE TABLE public.therapist_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist events table
CREATE TABLE public.therapist_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  price NUMERIC DEFAULT 0,
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist followers table
CREATE TABLE public.therapist_followers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(therapist_id, user_id)
);

-- Create therapist appointments table
CREATE TABLE public.therapist_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- in minutes
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  price NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist availability table
CREATE TABLE public.therapist_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(therapist_id, day_of_week, start_time)
);

-- Create therapist earnings table
CREATE TABLE public.therapist_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.therapist_appointments(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  transaction_type TEXT DEFAULT 'earning', -- earning, withdrawal
  status TEXT DEFAULT 'pending', -- pending, completed, cancelled
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist profile views table
CREATE TABLE public.therapist_profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.therapists(id) ON DELETE CASCADE,
  viewer_id UUID, -- null for anonymous views
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.therapist_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profile_views ENABLE ROW LEVEL SECURITY;

-- Policies for therapist_posts
CREATE POLICY "Everyone can view published posts" ON public.therapist_posts
FOR SELECT USING (is_published = true);

CREATE POLICY "Therapists can manage their own posts" ON public.therapist_posts
FOR ALL USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Admins can manage all posts" ON public.therapist_posts
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for therapist_events
CREATE POLICY "Everyone can view active events" ON public.therapist_events
FOR SELECT USING (is_active = true);

CREATE POLICY "Therapists can manage their own events" ON public.therapist_events
FOR ALL USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Admins can manage all events" ON public.therapist_events
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for therapist_followers
CREATE POLICY "Users can view their own follows" ON public.therapist_followers
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own follows" ON public.therapist_followers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow" ON public.therapist_followers
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Therapists can view their followers" ON public.therapist_followers
FOR SELECT USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

-- Policies for therapist_appointments
CREATE POLICY "Users can view their own appointments" ON public.therapist_appointments
FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Therapists can manage their appointments" ON public.therapist_appointments
FOR ALL USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Users can create appointments" ON public.therapist_appointments
FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Policies for therapist_availability
CREATE POLICY "Everyone can view availability" ON public.therapist_availability
FOR SELECT USING (true);

CREATE POLICY "Therapists can manage their availability" ON public.therapist_availability
FOR ALL USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

-- Policies for therapist_earnings
CREATE POLICY "Therapists can view their earnings" ON public.therapist_earnings
FOR SELECT USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Admins can manage all earnings" ON public.therapist_earnings
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Policies for therapist_profile_views
CREATE POLICY "Therapists can view their profile views" ON public.therapist_profile_views
FOR SELECT USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = therapist_id
));

CREATE POLICY "Anyone can create profile views" ON public.therapist_profile_views
FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_therapist_posts_therapist_id ON public.therapist_posts(therapist_id);
CREATE INDEX idx_therapist_posts_published ON public.therapist_posts(is_published);
CREATE INDEX idx_therapist_events_therapist_id ON public.therapist_events(therapist_id);
CREATE INDEX idx_therapist_followers_therapist_id ON public.therapist_followers(therapist_id);
CREATE INDEX idx_therapist_followers_user_id ON public.therapist_followers(user_id);
CREATE INDEX idx_therapist_appointments_therapist_id ON public.therapist_appointments(therapist_id);
CREATE INDEX idx_therapist_appointments_client_id ON public.therapist_appointments(client_id);
CREATE INDEX idx_therapist_availability_therapist_id ON public.therapist_availability(therapist_id);
CREATE INDEX idx_therapist_earnings_therapist_id ON public.therapist_earnings(therapist_id);
CREATE INDEX idx_therapist_profile_views_therapist_id ON public.therapist_profile_views(therapist_id);

-- Create triggers for updated_at
CREATE TRIGGER update_therapist_posts_updated_at
BEFORE UPDATE ON public.therapist_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapist_events_updated_at
BEFORE UPDATE ON public.therapist_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapist_appointments_updated_at
BEFORE UPDATE ON public.therapist_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();