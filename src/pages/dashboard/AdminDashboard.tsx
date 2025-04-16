
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CourseManagement from '@/components/admin/CourseManagement';
import StudentManagement from '@/components/admin/StudentManagement';
import TeacherManagement from '@/components/admin/TeacherManagement';
import AdminManagement from '@/components/admin/AdminManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import { Users, BookOpen, UserPlus, School, GraduationCap, Shield } from 'lucide-react';
import { 
  canManageStudents, 
  canManageTeachers,
  canManageCourses,
  canManageAdmins,
  canManageLeads,
  clearPermissionsCache,
  AdminLevel,
  updateCachedAdminRoles
} from '@/utils/adminPermissions';
import { fetchAdminRoles } from '@/components/superadmin/AdminService';

type ActiveTab = 'courses' | 'students' | 'teachers' | 'admins' | 'leads';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [permissionMap, setPermissionMap] = useState<{
    students: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    teachers: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    admins: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    leads: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
    courses: { view: boolean; add: boolean; edit: boolean; delete: boolean; };
  }>({
    students: { view: false, add: false, edit: false, delete: false },
    teachers: { view: false, add: false, edit: false, delete: false },
    admins: { view: false, add: false, edit: false, delete: false },
    leads: { view: false, add: false, edit: false, delete: false },
    courses: { view: false, add: false, edit: false, delete: false }
  });
  const [adminRoles, setAdminRoles] = useState<AdminLevel[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // Debug output to help troubleshoot
  useEffect(() => {
    if (user) {
      console.log('[AdminDashboard] User data:', user);
      console.log('[AdminDashboard] User role:', user.role);
    }
  }, [user]);

  // Clear permissions cache to ensure fresh checks
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
    } catch (error) {
      console.error('[AdminDashboard] Error loading admin roles:', error);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Check if user is a superadmin - this is a critical fix
    const isSuperAdminUser = user.role === 'superadmin';
    console.log('[AdminDashboard] Is user superadmin?', isSuperAdminUser);
    
    if (isSuperAdminUser) {
      console.log('[AdminDashboard] User is a superadmin - granting all permissions');
      
      // Grant all permissions for superadmin
      setPermissionMap({
        students: { view: true, add: true, edit: true, delete: true },
        teachers: { view: true, add: true, edit: true, delete: true },
        admins: { view: true, add: true, edit: true, delete: true },
        leads: { view: true, add: true, edit: true, delete: true },
        courses: { view: true, add: true, edit: true, delete: true }
      });
      
      // Set a default active tab for better UX
      setActiveTab('courses');
      return;
    }
    
    // Regular admin permissions check
    const userForPermissions = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt || new Date().toISOString(),
      adminRoleName: user.adminRoleName
    };
    
    console.log('[AdminDashboard] Checking permissions for:', userForPermissions);

    // Check permissions using the adminRoleName
    const canViewStudents = canManageStudents(userForPermissions, 'view');
    const canAddStudents = canManageStudents(userForPermissions, 'add');
    const canEditStudents = canManageStudents(userForPermissions, 'edit');
    const canDeleteStudents = canManageStudents(userForPermissions, 'delete');
    
    // Check teachers permissions
    const canViewTeachers = canManageTeachers(userForPermissions, 'view');
    const canAddTeachers = canManageTeachers(userForPermissions, 'add');
    const canEditTeachers = canManageTeachers(userForPermissions, 'edit');
    const canDeleteTeachers = canManageTeachers(userForPermissions, 'delete');
    
    // Check admins permissions
    const canViewAdmins = canManageAdmins(userForPermissions, 'view');
    const canAddAdmins = canManageAdmins(userForPermissions, 'add');
    const canEditAdmins = canManageAdmins(userForPermissions, 'edit');
    const canDeleteAdmins = canManageAdmins(userForPermissions, 'delete');
    
    // Check leads permissions
    const canViewLeads = canManageLeads(userForPermissions, 'view');
    const canAddLeads = canManageLeads(userForPermissions, 'add');
    const canEditLeads = canManageLeads(userForPermissions, 'edit');
    const canDeleteLeads = canManageLeads(userForPermissions, 'delete');
    
    // Check courses permissions
    const canViewCourses = canManageCourses(userForPermissions, 'view');
    const canAddCourses = canManageCourses(userForPermissions, 'add');
    const canEditCourses = canManageCourses(userForPermissions, 'edit');
    const canDeleteCourses = canManageCourses(userForPermissions, 'delete');
    
    console.log('Permission results:', {
      students: { view: canViewStudents, add: canAddStudents, edit: canEditStudents, delete: canDeleteStudents },
      teachers: { view: canViewTeachers, add: canAddTeachers, edit: canEditTeachers, delete: canDeleteTeachers },
      courses: { view: canViewCourses, add: canAddCourses, edit: canEditCourses, delete: canDeleteCourses },
    });
    
    setPermissionMap({
      students: {
        view: canViewStudents,
        add: canAddStudents,
        edit: canEditStudents,
        delete: canDeleteStudents
      },
      teachers: {
        view: canViewTeachers,
        add: canAddTeachers,
        edit: canEditTeachers,
        delete: canDeleteTeachers
      },
      admins: {
        view: canViewAdmins,
        add: canAddAdmins,
        edit: canEditAdmins,
        delete: canDeleteAdmins
      },
      leads: {
        view: canViewLeads,
        add: canAddLeads,
        edit: canEditLeads,
        delete: canDeleteLeads
      },
      courses: {
        view: canViewCourses,
        add: canAddCourses,
        edit: canEditCourses,
        delete: canDeleteCourses
      }
    });

    // Find first available tab to set as active
    const firstAvailableTab = [
      canViewCourses && 'courses',
      canViewStudents && 'students',
      canViewTeachers && 'teachers',
      canViewAdmins && 'admins',
      canViewLeads && 'leads'
    ].find(Boolean) as ActiveTab | undefined;

    console.log('First available tab:', firstAvailableTab);

    if (firstAvailableTab) {
      setActiveTab(firstAvailableTab);
    }
  }, [user, adminRoles]);
  
  // Count how many tabs are available
  const availableTabs = [
    permissionMap.courses.view && 'courses',
    permissionMap.students.view && 'students',
    permissionMap.teachers.view && 'teachers',
    permissionMap.admins.view && 'admins',
    permissionMap.leads.view && 'leads',
  ].filter(Boolean);

  console.log('[AdminDashboard] Available tabs:', availableTabs);
  console.log('[AdminDashboard] Current permission map:', permissionMap);

  const showTabNavigation = availableTabs.length > 1;

  // Check if admin has access to at least one section
  const hasAnyAccess = permissionMap.courses.view || 
                       permissionMap.students.view || 
                       permissionMap.teachers.view || 
                       permissionMap.admins.view || 
                       permissionMap.leads.view;

  console.log('[AdminDashboard] Has any access:', hasAnyAccess);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Your role: {user?.role} {user?.adminRoleName ? `(${user.adminRoleName})` : ''}
        </p>
      </div>

      {/* Only show tab navigation if user has access to more than one tab */}
      {showTabNavigation && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border bg-card p-1 text-card-foreground shadow">
            {permissionMap.courses.view && (
              <Button
                variant={activeTab === 'courses' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('courses')}
                className="rounded-md px-3 py-1"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Button>
            )}
            {permissionMap.students.view && (
              <Button
                variant={activeTab === 'students' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('students')}
                className="rounded-md px-3 py-1"
              >
                <School className="h-4 w-4 mr-2" />
                Students
              </Button>
            )}
            {permissionMap.teachers.view && (
              <Button
                variant={activeTab === 'teachers' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('teachers')}
                className="rounded-md px-3 py-1"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Teachers
              </Button>
            )}
            {permissionMap.admins.view && (
              <Button
                variant={activeTab === 'admins' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('admins')}
                className="rounded-md px-3 py-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admins
              </Button>
            )}
            {permissionMap.leads.view && (
              <Button
                variant={activeTab === 'leads' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('leads')}
                className="rounded-md px-3 py-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Leads
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        {activeTab === 'courses' && permissionMap.courses.view && (
          <CourseManagement 
            canAddCourse={permissionMap.courses.add}
            canDeleteCourse={permissionMap.courses.delete}
          />
        )}
        
        {activeTab === 'students' && permissionMap.students.view && (
          <StudentManagement 
            canAddUser={permissionMap.students.add}
            canDeleteUser={permissionMap.students.delete}
          />
        )}
        
        {activeTab === 'teachers' && permissionMap.teachers.view && (
          <TeacherManagement 
            canAddUser={permissionMap.teachers.add}
            canDeleteUser={permissionMap.teachers.delete}
          />
        )}
        
        {activeTab === 'admins' && permissionMap.admins.view && (
          <AdminManagement 
            canAddAdmin={permissionMap.admins.add}
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
    </div>
  );
};

export default AdminDashboard;
