
-- Enable Row Level Security on courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Admin policy: Admins can do everything
CREATE POLICY "Admins can do everything on courses"
ON public.courses
USING (auth.uid() IN (
  SELECT id FROM public.custom_users WHERE role = 'admin'
))
WITH CHECK (auth.uid() IN (
  SELECT id FROM public.custom_users WHERE role = 'admin'
));

-- Select policy: Everyone can view courses
CREATE POLICY "Everyone can view courses"
ON public.courses
FOR SELECT
USING (true);
