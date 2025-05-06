
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  clearPermissionCache, 
  updateCachedAdminRoles, 
  AdminLevel 
} from '@/utils/permissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import { AdminPermissionMap, getDefaultPermissionMap, getSuperAdminPermissionMap } from '@/components/admin/dashboard/PermissionMap';

export type ActiveTab = 'courses' | 'students' | 'teachers' | 'admins' | 'leads' | 'levels';

export const useAdminDashboardPermissions = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [permissionMap, setPermissionMap] = useState<AdminPermissionMap>(getDefaultPermissionMap());
  const [adminRoles, setAdminRoles] = useState<AdminLevel[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] Clearing permissions cache for user');
      clearPermissionCache();
      loadAdminRoles();
    }
  }, [user]);

  const loadAdminRoles = async () => {
    if (!user) return;
    
    try {
      setIsLoadingRoles(true);
      console.log('[AdminDashboard] Loading admin roles from database');
      const roles = await fetchAdminRoles();
      console.log('[AdminDashboard] Received admin roles:', roles);
      setAdminRoles(roles);
      updateCachedAdminRoles(roles);
      
      updateUserPermissions(roles);
    } catch (error) {
      console.error('[AdminDashboard] Error loading admin roles:', error);
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
    console.log('[AdminDashboard] Is user superadmin?', isSuperAdminUser);
    
    if (isSuperAdminUser) {
      console.log('[AdminDashboard] User is a superadmin - granting all permissions');
      
      setPermissionMap(getSuperAdminPermissionMap());
      setActiveTab('courses');
      return;
    }

    const adminRoleName = user.adminRoleName || "Limited View";
    console.log('[AdminDashboard] Looking for admin role:', adminRoleName);

    const userRole = roles.find(role => role.name === adminRoleName);
    
    if (userRole) {
      console.log('[AdminDashboard] Found matching role:', userRole);
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
        }
      });

      // Set initial active tab based on permissions
      if (userRole.coursePermissions.includes('view')) {
        setActiveTab('courses');
      } else if (userRole.studentPermissions.includes('view')) {
        setActiveTab('students');
      } else if (userRole.teacherPermissions.includes('view')) {
        setActiveTab('teachers');
      } else if (userRole.adminPermissions.includes('view')) {
        setActiveTab('admins');
      } else if (userRole.leadPermissions.includes('view')) {
        setActiveTab('leads');
      } else if (userRole.levelPermissions?.includes('view')) {
        setActiveTab('levels');
      }
    } else {
      console.log('[AdminDashboard] No matching role found for:', adminRoleName);
      setDebugInfo(`No matching role found in database for: ${adminRoleName}. Available roles: ${roles.map(r => r.name).join(', ')}`);
      
      // Set basic permissions
      setPermissionMap({
        students: { view: true, add: false, edit: false, delete: false },
        teachers: { view: true, add: false, edit: false, delete: false },
        admins: { view: false, add: false, edit: false, delete: false },
        leads: { view: false, add: false, edit: false, delete: false },
        courses: { view: true, add: false, edit: false, delete: false },
        levels: { view: false, add: false, edit: false, delete: false }
      });
      
      setActiveTab('courses');
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
  ].filter(Boolean) as ActiveTab[];

  const hasAnyAccess = permissionMap.courses.view || 
                       permissionMap.students.view || 
                       permissionMap.teachers.view || 
                       permissionMap.admins.view || 
                       permissionMap.leads.view ||
                       permissionMap.levels.view;

  return {
    activeTab,
    setActiveTab,
    permissionMap,
    isLoadingRoles,
    debugInfo,
    availableTabs,
    hasAnyAccess
  };
};
