
-- Enable Row Level Security on courses table
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Admin policy: Admins can do everything
CREATE POLICY "Admins can do everything on courses"
ON public.courses
USING (current_user = 'postgres' OR current_user = 'authenticated')
WITH CHECK (current_user = 'postgres' OR current_user = 'authenticated');

-- Insert policy: All authenticated users can insert courses
CREATE POLICY "All users can insert courses"
ON public.courses
FOR INSERT
WITH CHECK (true);

-- Select policy: Everyone can view courses
CREATE POLICY "Everyone can view courses"
ON public.courses
FOR SELECT
USING (true);
