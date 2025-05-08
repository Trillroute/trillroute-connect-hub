
import { useAuthContext } from '@/contexts/AuthContext';
import { useRoleManagement } from './useRoleManagement';

export const useAuth = () => {
  const { user } = useAuthContext();
  const { isAdmin, isSuperAdmin, role } = useRoleManagement();

  return {
    user,
    isAdmin,
    isSuperAdmin,
    role
  };
};
