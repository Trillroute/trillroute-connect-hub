
/**
 * Hook that provides utilities for filtering by role
 */
export const useRoleFilters = () => {
  // Helper function to get role filter values based on filter type
  const getRoleFilterForType = (type?: string | null): string[] => {
    if (!type) return [];
    
    switch (type) {
      case 'teacher': return ['teacher'];
      case 'student': return ['student'];
      case 'admin': return ['admin', 'superadmin'];
      case 'staff': return ['teacher', 'admin', 'superadmin'];
      default: return [];
    }
  };
  
  // Helper function to check if filter type is related to staff
  const isStaffFilterType = (type?: string | null): boolean => {
    return !!type && ['teacher', 'admin', 'staff'].includes(type);
  };

  return { getRoleFilterForType, isStaffFilterType };
};
