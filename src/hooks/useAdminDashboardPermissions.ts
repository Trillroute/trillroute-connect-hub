import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { AdminLevel } from '@/utils/permissions/types';
import { toast } from '@/hooks/use-toast';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import { clearPermissionsCache, updateCachedAdminRoles } from '@/utils/permissions';
import { convertToAdminLevels } from '@/utils/permissions/typeConverters';

type PermissionMap = {
  students: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  teachers: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  admins: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  leads: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  courses: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  levels: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  events: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  classTypes: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  userAvailability: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
};

export const useAdminDashboardPermissions = () => {
  const { user, isSuperAdmin } = useAuth();
  const [permissionMap, setPermissionMap] = useState<PermissionMap>({
    students: { view: false, add: false, edit: false, delete: false },
    teachers: { view: false, add: false, edit: false, delete: false },
    admins: { view: false, add: false, edit: false, delete: false },
    leads: { view: false, add: false, edit: false, delete: false },
    courses: { view: false, add: false, edit: false, delete: false },
    levels: { view: false, add: false, edit: false, delete: false },
    events: { view: false, add: false, edit: false, delete: false },
    classTypes: { view: false, add: false, edit: false, delete: false },
    userAvailability: { view: false, add: false, edit: false, delete: false }
  });
  const [adminRoles, setAdminRoles] = useState<AdminLevel[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('[AdminDashboardPermissions] Clearing permissions cache for user', user.id);
      clearPermissionsCache(user.id);
      loadAdminRoles();
    }
  }, [user]);

  const loadAdminRoles = async () => {
    if (!user) return;
    
    try {
      setIsLoadingRoles(true);
      console.log('[AdminDashboardPermissions] Loading admin roles from database');
      const roles = await fetchAdminRoles();
      console.log('[AdminDashboardPermissions] Received admin roles:', roles);
      
      // Convert AdminLevelDetailed[] to AdminLevel[]
      const convertedRoles = convertToAdminLevels(roles);
      setAdminRoles(convertedRoles);
      updateCachedAdminRoles(convertedRoles);
      
      updateUserPermissions(convertedRoles);
    } catch (error) {
      console.error('[AdminDashboardPermissions] Error loading admin roles:', error);
      toast({
        title: "Error loading permissions",
        description: "Could not load permission roles from database",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const updateUserPermissions = (roles: AdminLevel[]) => {
    if (!user) return;
    
    const isSuperAdminUser = user.role === 'superadmin';
    console.log('[AdminDashboardPermissions] Is user superadmin?', isSuperAdminUser);
    
    if (isSuperAdminUser) {
      console.log('[AdminDashboardPermissions] User is a superadmin - granting all permissions');
      
      setPermissionMap({
        students: { view: true, add: true, edit: true, delete: true },
        teachers: { view: true, add: true, edit: true, delete: true },
        admins: { view: true, add: true, edit: true, delete: true },
        leads: { view: true, add: true, edit: true, delete: true },
        courses: { view: true, add: true, edit: true, delete: true },
        levels: { view: true, add: true, edit: true, delete: true },
        events: { view: true, add: true, edit: true, delete: true },
        classTypes: { view: true, add: true, edit: true, delete: true },
        userAvailability: { view: true, add: true, edit: true, delete: true }
      });
      
      return;
    }

    const adminRoleName = user.adminRoleName || "Limited View";
    console.log('[AdminDashboardPermissions] Looking for admin role:', adminRoleName);

    const userRole = roles.find(role => role.name === adminRoleName);
    
    if (userRole) {
      console.log('[AdminDashboardPermissions] Found matching role:', userRole);
      setDebugInfo(null);

      setPermissionMap({
        students: {
          view: userRole.studentPermissions.includes('view'),
          add: userRole.studentPermissions.includes('add'),
          edit: userRole.studentPermissions.includes('edit'),
          delete: userRole.studentPermissions.includes('delete')
        },
        teachers: {
          view: userRole.teacherPermissions.includes('view'),
          add: userRole.teacherPermissions.includes('add'),
          edit: userRole.teacherPermissions.includes('edit'),
          delete: userRole.teacherPermissions.includes('delete')
        },
        admins: {
          view: userRole.adminPermissions.includes('view'),
          add: userRole.adminPermissions.includes('add'),
          edit: userRole.adminPermissions.includes('edit'),
          delete: userRole.adminPermissions.includes('delete')
        },
        leads: {
          view: userRole.leadPermissions.includes('view'),
          add: userRole.leadPermissions.includes('add'),
          edit: userRole.leadPermissions.includes('edit'),
          delete: userRole.leadPermissions.includes('delete')
        },
        courses: {
          view: userRole.coursePermissions.includes('view'),
          add: userRole.coursePermissions.includes('add'),
          edit: userRole.coursePermissions.includes('edit'),
          delete: userRole.coursePermissions.includes('delete')
        },
        levels: {
          view: userRole.levelPermissions?.includes('view') || false,
          add: userRole.levelPermissions?.includes('add') || false,
          edit: userRole.levelPermissions?.includes('edit') || false,
          delete: userRole.levelPermissions?.includes('delete') || false
        },
        events: {
          view: userRole.eventsPermissions?.includes('view') || false,
          add: userRole.eventsPermissions?.includes('add') || false,
          edit: userRole.eventsPermissions?.includes('edit') || false,
          delete: userRole.eventsPermissions?.includes('delete') || false
        },
        classTypes: {
          view: userRole.classTypesPermissions?.includes('view') || false,
          add: userRole.classTypesPermissions?.includes('add') || false,
          edit: userRole.classTypesPermissions?.includes('edit') || false,
          delete: userRole.classTypesPermissions?.includes('delete') || false
        },
        userAvailability: {
          view: userRole.userAvailabilityPermissions?.includes('view') || false,
          add: userRole.userAvailabilityPermissions?.includes('add') || false,
          edit: userRole.userAvailabilityPermissions?.includes('edit') || false,
          delete: userRole.userAvailabilityPermissions?.includes('delete') || false
        }
      });
    } else {
      console.log('[AdminDashboardPermissions] No matching role found for:', adminRoleName);
      setDebugInfo(`No matching role found in database for: ${adminRoleName}. Available roles: ${roles.map(r => r.name).join(', ')}`);
      
      setPermissionMap({
        students: { view: true, add: false, edit: false, delete: false },
        teachers: { view: true, add: false, edit: false, delete: false },
        admins: { view: false, add: false, edit: false, delete: false },
        leads: { view: false, add: false, edit: false, delete: false },
        courses: { view: true, add: false, edit: false, delete: false },
        levels: { view: false, add: false, edit: false, delete: false },
        events: { view: false, add: false, edit: false, delete: false },
        classTypes: { view: false, add: false, edit: false, delete: false },
        userAvailability: { view: false, add: false, edit: false, delete: false }
      });
    }
  };

  useEffect(() => {
    if (adminRoles.length > 0 && user) {
      updateUserPermissions(adminRoles);
    }
  }, [adminRoles, user]);

  const availableTabs = [
    permissionMap.courses.view && 'courses',
    permissionMap.students.view && 'students',
    permissionMap.teachers.view && 'teachers',
    permissionMap.admins.view && 'admins',
    permissionMap.leads.view && 'leads',
    permissionMap.levels.view && 'levels',
    permissionMap.events.view && 'events',
    permissionMap.classTypes.view && 'classTypes',
    permissionMap.userAvailability.view && 'userAvailability',
  ].filter(Boolean) as string[];

  const hasAnyAccess = permissionMap.courses.view || 
                       permissionMap.students.view || 
                       permissionMap.teachers.view || 
                       permissionMap.admins.view || 
                       permissionMap.leads.view ||
                       permissionMap.levels.view ||
                       permissionMap.events.view ||
                       permissionMap.classTypes.view ||
                       permissionMap.userAvailability.view;

  return {
    permissionMap,
    isLoadingRoles,
    debugInfo,
    availableTabs,
    hasAnyAccess,
    loadAdminRoles
  };
};
