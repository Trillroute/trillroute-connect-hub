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
  AdminPermission,
  hasPermission,
  clearPermissionsCache
} from '@/utils/adminPermissions';

type ActiveTab = 'courses' | 'students' | 'teachers' | 'admins' | 'leads';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('courses');
  const [permissionMap, setPermissionMap] = useState<{
    viewStudents: boolean;
    addStudents: boolean;
    removeStudents: boolean;
    viewTeachers: boolean;
    addTeachers: boolean;
    removeTeachers: boolean;
    viewAdmins: boolean;
    addAdmins: boolean;
    removeAdmins: boolean;
    editAdminLevel: boolean;
    viewCourses: boolean;
    addCourses: boolean;
    removeCourses: boolean;
    viewLeads: boolean;
  }>({
    viewStudents: false,
    addStudents: false,
    removeStudents: false,
    viewTeachers: false,
    addTeachers: false,
    removeTeachers: false,
    viewAdmins: false,
    addAdmins: false,
    removeAdmins: false,
    editAdminLevel: false,
    viewCourses: false,
    addCourses: false,
    removeCourses: false,
    viewLeads: false,
  });

  // Clear permissions cache to ensure fresh checks
  useEffect(() => {
    if (user) {
      clearPermissionsCache(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const userForPermissions = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt || new Date().toISOString(),
        adminLevel: user.adminLevel
      };

      const canViewStudents = canManageStudents(userForPermissions, 'view');
      const canViewTeachers = canManageTeachers(userForPermissions, 'view');
      const canAddStudents = canManageStudents(userForPermissions, 'add');
      const canAddTeachers = canManageTeachers(userForPermissions, 'add');
      const canRemoveStudents = canManageStudents(userForPermissions, 'remove');
      const canRemoveTeachers = canManageTeachers(userForPermissions, 'remove');
      
      // Only superadmins can manage other admins
      const canViewAdmins = user.role === 'superadmin';
      const canAddAdmins = user.role === 'superadmin';
      const canRemoveAdmins = user.role === 'superadmin';
      const canEditAdminLevel = user.role === 'superadmin';
      
      setPermissionMap({
        viewStudents: canViewStudents,
        addStudents: canAddStudents,
        removeStudents: canRemoveStudents,
        viewTeachers: canViewTeachers,
        addTeachers: canAddTeachers,
        removeTeachers: canRemoveTeachers,
        viewAdmins: canViewAdmins,
        addAdmins: canAddAdmins,
        removeAdmins: canRemoveAdmins,
        editAdminLevel: canEditAdminLevel,
        viewCourses: canManageCourses(userForPermissions, 'view'),
        addCourses: canManageCourses(userForPermissions, 'add'),
        removeCourses: canManageCourses(userForPermissions, 'remove'),
        viewLeads: true, // All admins can view leads
      });

      // Ensure the active tab matches available permissions
      if (canManageCourses(userForPermissions, 'view')) {
        setActiveTab('courses');
      } else if (canViewStudents) {
        setActiveTab('students');
      } else if (canViewTeachers) {
        setActiveTab('teachers');
      } else if (canViewAdmins) {
        setActiveTab('admins');
      } else {
        setActiveTab('leads');
      }
    }
  }, [user]);

  const adminLevel = user?.adminLevel || 8; // Default to most restrictive level (8) if undefined
  const adminLevelName = getAdminLevelName(adminLevel);

  function getAdminLevelName(level: number): string {
    switch (level) {
      case 0: return 'Super Admin Equivalent';
      case 1: return 'Level 1';
      case 2: return 'Level 2';
      case 3: return 'Level 3';
      case 4: return 'Level 4';
      case 5: return 'Level 5';
      case 6: return 'Level 6';
      case 8: return 'Level 8';
      default: return `Level ${level}`;
    }
  }

  // Count how many tabs are available
  const availableTabs = [
    permissionMap.viewCourses && 'courses',
    permissionMap.viewStudents && 'students',
    permissionMap.viewTeachers && 'teachers',
    permissionMap.viewAdmins && 'admins',
    permissionMap.viewLeads && 'leads',
  ].filter(Boolean);

  const showTabNavigation = availableTabs.length > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Only show tab navigation if user has access to more than one tab */}
      {showTabNavigation && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border bg-card p-1 text-card-foreground shadow">
            {permissionMap.viewCourses && (
              <Button
                variant={activeTab === 'courses' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('courses')}
                className="rounded-md px-3 py-1"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Courses
              </Button>
            )}
            {permissionMap.viewStudents && (
              <Button
                variant={activeTab === 'students' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('students')}
                className="rounded-md px-3 py-1"
              >
                <School className="h-4 w-4 mr-2" />
                Students
              </Button>
            )}
            {permissionMap.viewTeachers && (
              <Button
                variant={activeTab === 'teachers' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('teachers')}
                className="rounded-md px-3 py-1"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Teachers
              </Button>
            )}
            {permissionMap.viewAdmins && (
              <Button
                variant={activeTab === 'admins' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('admins')}
                className="rounded-md px-3 py-1"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admins
              </Button>
            )}
            {permissionMap.viewLeads && (
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
        {activeTab === 'courses' && permissionMap.viewCourses && (
          <CourseManagement />
        )}
        
        {activeTab === 'students' && permissionMap.viewStudents && (
          <StudentManagement 
            canAddUser={permissionMap.addStudents}
            canDeleteUser={permissionMap.removeStudents}
          />
        )}
        
        {activeTab === 'teachers' && permissionMap.viewTeachers && (
          <TeacherManagement 
            canAddUser={permissionMap.addTeachers}
            canDeleteUser={permissionMap.removeTeachers}
          />
        )}
        
        {activeTab === 'admins' && permissionMap.viewAdmins && (
          <AdminManagement 
            canAddAdmin={permissionMap.addAdmins}
            canDeleteAdmin={permissionMap.removeAdmins}
            canEditAdminLevel={permissionMap.editAdminLevel}
          />
        )}
        
        {activeTab === 'leads' && permissionMap.viewLeads && (
          <LeadManagement />
        )}

        {(!permissionMap.viewCourses && !permissionMap.viewStudents && 
          !permissionMap.viewTeachers && !permissionMap.viewAdmins && 
          !permissionMap.viewLeads) && (
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
