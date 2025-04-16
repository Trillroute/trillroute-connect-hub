
-- Function to retrieve student profile data
CREATE OR REPLACE FUNCTION public.get_student_profile(user_id_param UUID)
RETURNS TABLE (
  date_of_birth TEXT,
  profile_photo TEXT,
  parent_name TEXT,
  guardian_relation TEXT,
  primary_phone TEXT,
  secondary_phone TEXT,
  whatsapp_enabled BOOLEAN,
  address TEXT,
  id_proof TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.date_of_birth,
    sp.profile_photo,
    sp.parent_name,
    sp.guardian_relation,
    sp.primary_phone,
    sp.secondary_phone,
    sp.whatsapp_enabled,
    sp.address,
    sp.id_proof
  FROM 
    public.student_profiles sp
  WHERE 
    sp.user_id = user_id_param;
END;
$$;

-- Function to create a student profile
CREATE OR REPLACE FUNCTION public.create_student_profile(
  user_id_param UUID,
  date_of_birth_param TEXT,
  profile_photo_param TEXT,
  parent_name_param TEXT,
  guardian_relation_param TEXT,
  primary_phone_param TEXT,
  secondary_phone_param TEXT,
  whatsapp_enabled_param BOOLEAN,
  address_param TEXT,
  id_proof_param TEXT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.student_profiles (
    user_id,
    date_of_birth,
    profile_photo,
    parent_name,
    guardian_relation,
    primary_phone,
    secondary_phone,
    whatsapp_enabled,
    address,
    id_proof
  ) VALUES (
    user_id_param,
    date_of_birth_param,
    profile_photo_param,
    parent_name_param,
    guardian_relation_param,
    primary_phone_param,
    secondary_phone_param,
    whatsapp_enabled_param,
    address_param,
    id_proof_param
  );
END;
$$;
