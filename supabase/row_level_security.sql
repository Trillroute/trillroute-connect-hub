
-- ... keep existing code

-- Update the RLS policy for user_availability table to allow admins to manage teacher availability
-- and superadmins to manage both teacher and admin availability
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

-- ... keep existing code
