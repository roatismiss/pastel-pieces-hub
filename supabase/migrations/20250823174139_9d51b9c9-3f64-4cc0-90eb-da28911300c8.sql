-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create therapists table
CREATE TABLE public.therapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    avatar_url TEXT,
    specialization TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    languages TEXT[] DEFAULT ARRAY['Română'],
    availability TEXT DEFAULT 'Disponibil',
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on therapists
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for therapists
CREATE POLICY "Everyone can view therapists"
ON public.therapists
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage therapists"
ON public.therapists
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger for therapists
CREATE TRIGGER update_therapists_updated_at
    BEFORE UPDATE ON public.therapists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample therapists data
INSERT INTO public.therapists (name, specialization, rating, review_count, price, languages, bio, is_verified) VALUES
('Dr. Maria Ionescu', 'Psihoterapie Cognitiv-Comportamentală', 4.8, 127, 200.00, ARRAY['Română', 'Engleză'], 'Specialist în anxietate și depresie cu peste 10 ani experiență în terapia cognitiv-comportamentală.', true),
('Psih. Andrei Popescu', 'Terapie de Cuplu', 4.9, 95, 180.00, ARRAY['Română'], 'Expert în terapia de cuplu și consiliere familială. Ajut cuplurile să își îmbunătățească comunicarea.', true),
('Dr. Elena Georgescu', 'Psihoterapie Integrativă', 4.7, 156, 220.00, ARRAY['Română', 'Franceză'], 'Abordare integrativă pentru tulburări de anxietate, depresie și traumă. Specializare în EMDR.', true),
('Psih. Radu Stoica', 'Psihologie Clinică', 4.6, 89, 170.00, ARRAY['Română'], 'Specialist în evaluări psihologice și intervenții pentru adolescenți și adulți.', true),
('Dr. Ana Dumitrescu', 'Terapie Sistemică', 4.9, 112, 250.00, ARRAY['Română', 'Italiană'], 'Terapie sistemică pentru familii și cupluri. Experiență de 15 ani în domeniul sănătății mentale.', true);