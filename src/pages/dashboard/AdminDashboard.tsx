
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import LevelManagement from '@/components/admin/levels/LevelManagement';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  canManageStudents, 
  canManageTeachers,
  canManageCourses,
  canManageAdmins,
  canManageLeads,
  canManageLevels,
  clearPermissionsCache,
  AdminLevel,
  updateCachedAdminRoles
} from '@/utils/adminPermissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminRoleService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

type ActiveTab = 'courses' | 'students' | 'teachers' | 'admins' | 'leads' | 'levels';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [permissionMap, setPermissionMap] = useState<{
    students: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    teachers: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    admins: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    leads: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    courses: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    levels: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  }>({
    students: { view: false, add: false, edit: false, delete: false },
    teachers: { view: false, add: false, edit: false, delete: false },
    admins: { view: false, add: false, edit: false, delete: false },
    leads: { view: false, add: false, edit: false, delete: false },
    courses: { view: false, add: false, edit: false, delete: false },
    levels: { view: false, add: false, edit: false, delete: false }
  });
  const [adminRoles, setAdminRoles] = useState<AdminLevel[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] User data:', user);
      console.log('[AdminDashboard] User role:', user.role);
      console.log('[AdminDashboard] User adminRoleName:', user.adminRoleName);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] Clearing permissions cache for user', user.id);
      clearPermissionsCache(user.id);
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
      
      setPermissionMap({
        students: { view: true, add: true, edit: true, delete: true },
        teachers: { view: true, add: true, edit: true, delete: true },
        admins: { view: true, add: true, edit: true, delete: true },
        leads: { view: true, add: true, edit: true, delete: true },
        courses: { view: true, add: true, edit: true, delete: true },
        levels: { view: true, add: true, edit: true, delete: true }
      });
      
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
  ].filter(Boolean);

  console.log('[AdminDashboard] Available tabs:', availableTabs);
  console.log('[AdminDashboard] Current permission map:', permissionMap);

  const hasAnyAccess = permissionMap.courses.view || 
                       permissionMap.students.view || 
                       permissionMap.teachers.view || 
                       permissionMap.admins.view || 
                       permissionMap.leads.view ||
                       permissionMap.levels.view;

  const handleSidebarToggle = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen bg-background flex w-full" style={{ height: "100vh" }}>
      <ResizablePanel defaultSize={sidebarCollapsed ? 8 : 22} minSize={8} maxSize={28} collapsible={true} collapsedSize={5}>
        <AdminSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleSidebarToggle}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as ActiveTab)}
          permissionMap={{
            courses: { view: permissionMap.courses.view },
            students: { view: permissionMap.students.view },
            teachers: { view: permissionMap.teachers.view },
            admins: { view: permissionMap.admins.view },
            leads: { view: permissionMap.leads.view },
            levels: { view: permissionMap.levels.view }
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={30} defaultSize={78}>
        <div className="p-4 md:p-6 overflow-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            {debugInfo && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Debug Information</AlertTitle>
                <AlertDescription>{debugInfo}</AlertDescription>
              </Alert>
            )}
          </div>
          {isLoadingRoles ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading permissions...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'teachers' && permissionMap.teachers.view && (
                <div className="mb-4">
                  <Link 
                    to="/admin/teacher-registration" 
                    className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-music-500 text-white hover:bg-music-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-music-500 focus-visible:ring-offset-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Teacher
                  </Link>
                </div>
              )}
              {activeTab === 'courses' && permissionMap.courses.view && (
                <CourseManagement 
                  canAddCourse={permissionMap.courses.add}
                  canEditCourse={permissionMap.courses.edit}
                  canDeleteCourse={permissionMap.courses.delete}
                />
              )}
              {activeTab === 'students' && permissionMap.students.view && (
                <StudentManagement 
                  canAddUser={permissionMap.students.add}
                  canEditUser={permissionMap.students.edit}
                  canDeleteUser={permissionMap.students.delete}
                />
              )}
              {activeTab === 'teachers' && permissionMap.teachers.view && (
                <TeacherManagement 
                  canAddUser={permissionMap.teachers.add}
                  canEditUser={permissionMap.teachers.edit}
                  canDeleteUser={permissionMap.teachers.delete}
                />
              )}
              {activeTab === 'admins' && permissionMap.admins.view && (
                <AdminManagement 
                  canAddAdmin={permissionMap.admins.add}
                  canEditAdmin={permissionMap.admins.edit}
                  canDeleteAdmin={permissionMap.admins.delete}
                  canEditAdminLevel={permissionMap.admins.edit}
                />
              )}
              {activeTab === 'leads' && permissionMap.leads.view && (
                <LeadManagement 
                  canAddLead={permissionMap.leads.add}
                  canEditLead={permissionMap.leads.edit}
                  canDeleteLead={permissionMap.leads.delete}
                />
              )}
              {activeTab === 'levels' && permissionMap.levels.view && (
                <LevelManagement 
                  canAddLevel={permissionMap.levels.add}
                  canEditLevel={permissionMap.levels.edit}
                  canDeleteLevel={permissionMap.levels.delete}
                />
              )}
              {!hasAnyAccess && (
                <Card>
                  <CardHeader>
                    <CardTitle>Limited Access</CardTitle>
                    <CardDescription>
                      You don't have permissions to access any admin sections.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Please contact a super administrator to update your permissions.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AdminDashboard;
