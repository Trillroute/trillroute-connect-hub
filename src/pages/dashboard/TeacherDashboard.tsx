import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, BookOpen } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Teacher Dashboard</h1>
        <p className="text-gray-500">Welcome, {user?.firstName} {user?.lastName}!</p>
      </div>

      <Tabs defaultValue="classes" className="w-full">
        <TabsList>
          <TabsTrigger value="classes"><BookOpen className="mr-2 h-4 w-4" /> My Classes</TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" /> Schedule</TabsTrigger>
          <TabsTrigger value="students"><Users className="mr-2 h-4 w-4" /> Students</TabsTrigger>
        </TabsList>
        <TabsContent value="classes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Classes</CardTitle>
              <CardDescription>Manage your active classes and assignments.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Here you can view and manage the classes you are teaching.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Schedule</CardTitle>
              <CardDescription>View your teaching schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>See your upcoming classes and plan your week.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Students</CardTitle>
              <CardDescription>Manage and view your students.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View a list of students enrolled in your classes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
