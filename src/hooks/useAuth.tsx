import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, hashPassword, verifyPassword } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StudentProfile, StudentProfileData } from '@/types/student';

export type UserRole = 'student' | 'teacher' | 'admin';

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  studentProfile?: StudentProfile;
}

// Update the interface to match custom_users table
interface CustomUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole, studentData?: Omit<StudentProfileData, 'user_id'>) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`[AUTH] Login attempt for email: ${normalizedEmail}`);
      
      console.log(`[AUTH] DEBUG - querying for email: ${normalizedEmail}`);
      
      const { data: allUsers, error: allUsersError } = await supabase
        .from('custom_users')
        .select('email');
        
      if (allUsersError) {
        console.error('[AUTH] Error fetching all users:', allUsersError);
      } else {
        console.log('[AUTH] All users in database:', allUsers);
      }
      
      const { data: users, error: queryError } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', normalizedEmail);
      
      console.log(`[AUTH] Query returned ${users?.length || 0} users`);
      
      if (queryError) {
        console.error('[AUTH] Database error:', queryError);
        throw new Error('Error connecting to the database. Please try again.');
      }
      
      if (!users || users.length === 0) {
        console.error('[AUTH] No user found with email:', normalizedEmail);
        throw new Error('Invalid email or password');
      }
      
      const userData = users[0] as CustomUser;
      console.log(`[AUTH] Found user with ID: ${userData.id}`);
      
      const isPasswordValid = await verifyPassword(password, userData.password_hash);
      console.log(`[AUTH] Password verification result: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        console.error('[AUTH] Password verification failed');
        throw new Error('Invalid email or password');
      }
      
      console.log('[AUTH] Login successful');

      let studentProfile = null;
      if (userData.role === 'student') {
        const { data: studentData, error: studentError } = await supabase
          .rpc('get_student_profile', {
            user_id_param: userData.id
          });
        
        if (studentError) {
          console.error('[AUTH] Error fetching student profile:', studentError);
        } else if (studentData) {
          studentProfile = {
            id: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            dateOfBirth: studentData.date_of_birth,
            profilePhoto: studentData.profile_photo,
            parentName: studentData.parent_name,
            guardianRelation: studentData.guardian_relation,
            primaryPhone: studentData.primary_phone,
            secondaryPhone: studentData.secondary_phone,
            whatsappEnabled: studentData.whatsapp_enabled,
            address: studentData.address,
            idProof: studentData.id_proof
          };
        }
      }
      
      const authUser: UserData = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role,
        studentProfile: studentProfile || undefined,
      };
      
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${authUser.firstName}!`,
        duration: 3000,
      });
      
      navigate(`/dashboard/${authUser.role}`);
    } catch (error: any) {
      console.error('[AUTH] Login error:', error);
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole,
    studentData?: Omit<StudentProfileData, 'user_id'>
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

      const passwordHash = await hashPassword(password);

      const userId = crypto.randomUUID();

      const { error } = await supabase
        .from('custom_users')
        .insert({
          id: userId,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: role,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      if (role === 'student' && studentData) {
        const { error: studentError } = await supabase
          .rpc('create_student_profile', {
            user_id_param: userId,
            date_of_birth_param: studentData.date_of_birth || null,
            profile_photo_param: studentData.profile_photo || null,
            parent_name_param: studentData.parent_name || null,
            guardian_relation_param: studentData.guardian_relation || null,
            primary_phone_param: studentData.primary_phone || null,
            secondary_phone_param: studentData.secondary_phone || null,
            whatsapp_enabled_param: studentData.whatsapp_enabled || false,
            address_param: studentData.address || null,
            id_proof_param: studentData.id_proof || null
          });

        if (studentError) {
          console.error('Error creating student profile:', studentError);
        }
      }

      const userData: UserData = {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
        studentProfile: role === 'student' ? {
          id: userId,
          firstName,
          lastName,
          email: email.toLowerCase(),
          dateOfBirth: studentData?.date_of_birth,
          profilePhoto: studentData?.profile_photo,
          parentName: studentData?.parent_name,
          guardianRelation: studentData?.guardian_relation,
          primaryPhone: studentData?.primary_phone,
          secondaryPhone: studentData?.secondary_phone,
          whatsappEnabled: studentData?.whatsapp_enabled,
          address: studentData?.address,
          idProof: studentData?.id_proof
        } : undefined
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

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

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    role: user?.role || null,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
