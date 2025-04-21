
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, BookOpen } from 'lucide-react';
import TeacherProfileCompletion from "@/components/teacher/dashboard/TeacherProfileCompletion";
import TeacherCoursesSection from "@/components/teacher/dashboard/TeacherCoursesSection";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const TeacherDashboard = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <TeacherProfileCompletion />
      </div>
      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses"><BookOpen className="mr-2 h-4 w-4" /> My Courses</TabsTrigger>
          <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" /> Schedule</TabsTrigger>
          <TabsTrigger value="students"><Users className="mr-2 h-4 w-4" /> Students</TabsTrigger>
        </TabsList>
        <TabsContent value="courses" className="mt-4">
          <TeacherCoursesSection />
        </TabsContent>
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Schedule</CardTitle>
              <CardDescription>View your teaching schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>See your upcoming courses and plan your week.</p>
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
              <p>View a list of students enrolled in your courses.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default TeacherDashboard;
