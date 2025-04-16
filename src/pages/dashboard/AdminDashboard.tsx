
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import CourseManagement from '@/components/admin/CourseManagement';
import UserManagement from '@/components/admin/UserManagement';
import LeadManagement from '@/components/admin/LeadManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Manage courses, students and leads.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement allowAdminCreation={false} />
        </TabsContent>
        
        <TabsContent value="leads">
          <LeadManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
