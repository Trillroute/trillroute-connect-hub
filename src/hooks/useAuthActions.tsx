
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserData, UserRole } from '@/types/auth';
import { hashPassword, verifyPassword } from '@/integrations/supabase/client';

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
      
      // First check if user exists in our custom_users table
      const { data: usersCheck, error: checkError } = await supabase
        .from('custom_users')
        .select('id, email, password_hash, first_name, last_name, role, date_of_birth, profile_photo, parent_name, guardian_relation, primary_phone, secondary_phone, whatsapp_enabled, address, id_proof, created_at, admin_level_name')
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
      
      // Verify the password directly against our stored password_hash in custom_users
      const user = usersCheck[0];
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        console.error('[AUTH] Invalid password for user:', normalizedEmail);
        toast({
          title: "Login Failed",
          description: "Invalid password. Please check your credentials and try again.",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error("Invalid password");
      }
      
      // If we get here, password is valid - try to sign in with Supabase Auth
      // This is for session management only
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });

      if (authError) {
        console.log('[AUTH] User authenticated in custom_users but Supabase Auth failed. Creating auth user...');
        
        // Try to sign up the user first if they don't exist in auth yet
        const { error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: password,
        });
        
        if (!signUpError) {
          // Try login again
          const { data: retryAuth, error: retryError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password: password,
          });
          
          if (!retryError) {
            console.log('[AUTH] Successfully created and logged in auth user');
          } else {
            console.error('[AUTH] Retry login failed:', retryError);
            // Even if this fails, we continue since user is authenticated against custom_users
          }
        } else {
          console.error('[AUTH] Failed to create auth user:', signUpError);
          // Even if this fails, we continue since user is authenticated against custom_users
        }
      }
      
      // Prepare user data from our custom_users table
      const userData: UserData = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role as UserRole,
        dateOfBirth: user.date_of_birth,
        profilePhoto: user.profile_photo,
        parentName: user.parent_name,
        guardianRelation: user.guardian_relation,
        primaryPhone: user.primary_phone,
        secondaryPhone: user.secondary_phone,
        whatsappEnabled: user.whatsapp_enabled,
        address: user.address,
        idProof: user.id_proof,
        createdAt: user.created_at,
        adminRoleName: user.admin_level_name
      };
      
      // Set user data and store in localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.firstName}!`,
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
  
  // Provide more specific error messages based on the error code
  if (error.message.includes('Invalid login')) {
    console.log('[AUTH] Invalid login credentials error');
    throw new Error("Login failed. Please check your credentials.");
  }
  
  throw error;
};

const handleLoginError = (error: any) => {
  console.error('[AUTH] Login error:', error);
  if (!error.message || (error.message !== "Account not found" && 
      error.message !== "Invalid password" && 
      error.message !== "Login failed. Please check your credentials.")) {
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
