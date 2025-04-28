
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserData, UserRole } from '@/types/auth';

export const useAuthActions = (
  setUser: (user: UserData | null) => void,
  setLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log(`[AUTH] Login attempt for email: ${normalizedEmail}`);
      
      const { data: usersCheck, error: checkError } = await supabase
        .from('custom_users')
        .select('email')
        .eq('email', normalizedEmail)
        .limit(1);
      
      if (checkError) {
        console.error('[AUTH] Error checking user existence:', checkError);
        throw new Error("Error connecting to the database. Please try again.");
      } 
      
      if (!usersCheck || usersCheck.length === 0) {
        console.error('[AUTH] No account found with email:', normalizedEmail);
        toast({
          title: "Account Not Found",
          description: "No account found with this email address. Please check your email or register for a new account.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Account not found");
      }
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });
      
      if (authError) {
        handleAuthError(authError);
        throw new Error(authError.message || 'Login failed');
      }
      
      if (!authData.user) {
        console.error('[AUTH] Auth successful but no user returned');
        throw new Error("Authentication error. Please try again.");
      }
      
      await fetchAndSetUserData(normalizedEmail, setUser);
      
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
        duration: 3000,
      });
    } catch (error: any) {
      handleLoginError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    login,
    logout
  };
};

// Helper functions
const handleAuthError = (error: any) => {
  console.error('[AUTH] Supabase auth error:', error);
  if (error.message.includes('Invalid login')) {
    throw new Error("Incorrect password");
  }
  throw error;
};

const handleLoginError = (error: any) => {
  console.error('[AUTH] Login error:', error);
  if (!error.message || (error.message !== "Account not found" && error.message !== "Incorrect password")) {
    throw new Error(error?.message || "Something went wrong. Please try again.");
  }
  throw error;
};

const fetchAndSetUserData = async (email: string, setUser: (user: UserData | null) => void) => {
  const { data: users, error: queryError } = await supabase
    .from('custom_users')
    .select('*')
    .eq('email', email);
  
  if (queryError) {
    console.error('[AUTH] Database error:', queryError);
    throw new Error('Error connecting to the database. Please try again.');
  }
  
  if (!users || users.length === 0) {
    console.error('[AUTH] No user found with email:', email);
    throw new Error('User account data not found');
  }
  
  const userData = users[0];
  const userRole: UserRole = userData.role as UserRole;
  
  const updatedUser: UserData = {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userRole,
    dateOfBirth: userData.date_of_birth,
    profilePhoto: userData.profile_photo,
    parentName: userData.parent_name,
    guardianRelation: userData.guardian_relation,
    primaryPhone: userData.primary_phone,
    secondaryPhone: userData.secondary_phone,
    whatsappEnabled: userData.whatsapp_enabled,
    address: userData.address,
    idProof: userData.id_proof,
    createdAt: userData.created_at,
    adminRoleName: userData.admin_level_name
  };
  
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};
