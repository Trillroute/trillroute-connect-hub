
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CourseManagement from '@/components/admin/CourseManagement';
import UserManagement from '@/components/admin/UserManagement';
import LeadManagement from '@/components/admin/LeadManagement';
import { Users, BookOpen, UserPlus } from 'lucide-react';
import { 
  canManageStudents, 
  canManageTeachers, 
  canManageCourses,
  AdminPermission,
  hasPermission,
  clearPermissionsCache
} from '@/utils/adminPermissions';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'leads'>('courses');
  const [permissionMap, setPermissionMap] = useState<{
    viewUsers: boolean;
    addUsers: boolean;
    removeUsers: boolean;
    viewCourses: boolean;
    addCourses: boolean;
    removeCourses: boolean;
    viewLeads: boolean;
  }>({
    viewUsers: false,
    addUsers: false,
    removeUsers: false,
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
      
      setPermissionMap({
        viewUsers: canViewStudents || canViewTeachers,
        addUsers: canAddStudents || canAddTeachers,
        removeUsers: canRemoveStudents || canRemoveTeachers,
        viewCourses: canManageCourses(userForPermissions, 'view'),
        addCourses: canManageCourses(userForPermissions, 'add'),
        removeCourses: canManageCourses(userForPermissions, 'remove'),
        viewLeads: true, // All admins can view leads
      });

      // Ensure the active tab matches available permissions
      if (canManageCourses(userForPermissions, 'view')) {
        setActiveTab('courses');
      } else if (canViewStudents || canViewTeachers) {
        setActiveTab('users');
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName}! You are an admin with {adminLevelName} permissions.
        </p>
      </div>

      {/* Only show tab navigation if user has access to more than one tab */}
      {(
        (permissionMap.viewUsers && permissionMap.viewCourses) || 
        (permissionMap.viewUsers && permissionMap.viewLeads) || 
        (permissionMap.viewCourses && permissionMap.viewLeads)
      ) && (
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
            {permissionMap.viewUsers && (
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('users')}
                className="rounded-md px-3 py-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
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
        
        {activeTab === 'users' && permissionMap.viewUsers && (
          <UserManagement 
            allowAdminCreation={false} // Regular admins can't create other admins
            canAddUser={permissionMap.addUsers}
            canDeleteUser={permissionMap.removeUsers}
          />
        )}
        
        {activeTab === 'leads' && permissionMap.viewLeads && (
          <LeadManagement />
        )}

        {(!permissionMap.viewCourses && !permissionMap.viewUsers && !permissionMap.viewLeads) && (
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
