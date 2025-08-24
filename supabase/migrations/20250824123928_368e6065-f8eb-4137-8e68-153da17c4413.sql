-- Create therapist applications table for therapists to apply
CREATE TABLE public.therapist_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  specialization text NOT NULL,
  license_number text NOT NULL,
  years_experience integer NOT NULL,
  education text NOT NULL,
  bio text,
  certifications text[],
  languages text[] DEFAULT ARRAY['Română'::text],
  license_document_url text,
  cv_document_url text,
  certificate_urls text[],
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  applied_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapist_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist applications
CREATE POLICY "Users can create their own application" 
ON public.therapist_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own application" 
ON public.therapist_applications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their pending applications" 
ON public.therapist_applications 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all applications" 
ON public.therapist_applications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_therapist_applications_updated_at
BEFORE UPDATE ON public.therapist_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create community posts table for user posts/questions
CREATE TABLE public.community_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'post' CHECK (type IN ('post', 'question', 'mood')),
  title text,
  content text NOT NULL,
  mood text CHECK (mood IN ('happy', 'sad', 'anxious', 'excited', 'stressed', 'calm', 'angry', 'grateful')),
  tags text[],
  is_anonymous boolean DEFAULT false,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for community posts
CREATE POLICY "Users can create their own posts" 
ON public.community_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view active posts" 
ON public.community_posts 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can update their own posts" 
ON public.community_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.community_posts 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all community posts" 
ON public.community_posts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_posts_updated_at
BEFORE UPDATE ON public.community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create community comments table
CREATE TABLE public.community_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  like_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for community comments
CREATE POLICY "Users can create comments" 
ON public.community_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view active comments" 
ON public.community_comments 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can update their own comments" 
ON public.community_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.community_comments 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all community comments" 
ON public.community_comments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_community_comments_updated_at
BEFORE UPDATE ON public.community_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.community_comments 
ADD CONSTRAINT community_comments_post_id_fkey 
FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;

-- Update therapists table to link with user accounts
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.therapists ADD COLUMN IF NOT EXISTS application_id uuid;