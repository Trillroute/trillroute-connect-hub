
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { hashPassword } from '@/integrations/supabase/client';
import type { UserRole, StudentProfileData } from '@/types/auth';

export const useRegistration = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole,
    additionalData?: StudentProfileData
  ) => {
    setLoading(true);
    try {
      const { data: existingUser } = await supabase
        .from('custom_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const userId = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const passwordHash = await hashPassword(password);

      const insertData = {
        id: userId,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        role: role,
        created_at: createdAt,
        password_hash: passwordHash,
        ...(additionalData && {
          date_of_birth: additionalData.date_of_birth,
          profile_photo: additionalData.profile_photo,
          parent_name: additionalData.parent_name,
          guardian_relation: role === 'student' ? additionalData.guardian_relation : null,
          primary_phone: additionalData.primary_phone,
          secondary_phone: additionalData.secondary_phone,
          whatsapp_enabled: additionalData.whatsapp_enabled || false,
          address: additionalData.address,
          id_proof: additionalData.id_proof
        })
      };

      const { error } = await supabase
        .from('custom_users')
        .insert(insertData);

      if (error) {
        throw error;
      }

      toast({
        title: "Registration Successful",
        description: "Welcome to Trillroute!",
        duration: 3000,
      });

      navigate(`/dashboard/${role}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error?.message || "Please check your information and try again.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading
  };
};
