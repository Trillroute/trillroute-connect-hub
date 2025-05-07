
-- ... keep existing code

-- Update the RLS policy for user_availability table to allow admins to manage teacher availability
-- and superadmins to manage both teacher and admin availability
DROP POLICY IF EXISTS "Admins can manage teacher availability" ON public.user_availability;
CREATE POLICY "Admins can manage teacher availability" 
ON public.user_availability 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.custom_users 
    WHERE id = auth.uid() AND role = 'admin'
  ) AND EXISTS (
    SELECT 1 FROM public.custom_users
    WHERE id = user_id AND role = 'teacher'
  )
);

DROP POLICY IF EXISTS "Superadmins can manage all staff availability" ON public.user_availability;
CREATE POLICY "Superadmins can manage all staff availability" 
ON public.user_availability 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.custom_users 
    WHERE id = auth.uid() AND role = 'superadmin'
  ) AND EXISTS (
    SELECT 1 FROM public.custom_users
    WHERE id = user_id AND (role = 'teacher' OR role = 'admin' OR role = 'superadmin')
  )
);

DROP POLICY IF EXISTS "Users can manage their own availability" ON public.user_availability;
CREATE POLICY "Users can manage their own availability"
ON public.user_availability
FOR ALL
USING (auth.uid() = user_id);

-- ... keep existing code
