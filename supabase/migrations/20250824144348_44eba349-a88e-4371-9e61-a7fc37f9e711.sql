-- Allow users to create and manage their own therapist profile
-- Enable RLS already exists; we just add policies for insert/update

CREATE POLICY "Users can create their therapist profile"
ON public.therapists
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their therapist profile"
ON public.therapists
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);