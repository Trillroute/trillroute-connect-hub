
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, BookOpen } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ProfileCompletionDialog } from '@/components/teacher/ProfileCompletion/ProfileCompletionDialog';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myCoursesLoading, setMyCoursesLoading] = useState(true);

  const {
    loading,
    progress,
    formData,
    handleInputChange,
    handleQualificationChange,
    handleArrayChange,
    handleInstituteChange,
    addQualification,
    removeQualification,
    addInstitute,
    removeInstitute,
    saveProfile
  } = useTeacherProfile();

  useEffect(() => {
    // Fetch only if user is logged in and is a teacher
    if (!user || user.role !== "teacher") return;
    const fetchMyCourses = async () => {
      setMyCoursesLoading(true);
      try {
        // Get all courses where instructor_ids contains the teacher's id
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .contains('instructor_ids', [user.id]); // use array contains for matching teacher

        if (error) {
          console.error('Error fetching my classes:', error);
          setMyCourses([]);
          setMyCoursesLoading(false);
          return;
        }
        setMyCourses(data || []);
      } catch (err) {
        console.error('Unexpected error fetching my classes:', err);
        setMyCourses([]);
      } finally {
        setMyCoursesLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Teacher Dashboard</h1>
        <p className="text-gray-500">Welcome, {user?.firstName} {user?.lastName}!</p>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Profile Completion</p>
            <p className="text-sm font-medium">{Math.round(progress)}%</p>
          </div>
          <div 
            className="cursor-pointer" 
            onClick={() => setDialogOpen(true)}
          >
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Click to complete your profile
            </p>
          </div>
        </div>
      </div>

      <ProfileCompletionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleQualificationChange={handleQualificationChange}
        handleArrayChange={handleArrayChange}
        handleInstituteChange={handleInstituteChange}
        addQualification={addQualification}
        removeQualification={removeQualification}
        addInstitute={addInstitute}
        removeInstitute={removeInstitute}
        onSubmit={saveProfile}
      />

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
              {myCoursesLoading ? (
                <p>Loading classes...</p>
              ) : myCourses.length === 0 ? (
                <p>You are not assigned to any classes yet.</p>
              ) : (
                <div className="space-y-4">
                  {myCourses.map(course => (
                    <div key={course.id} className="border rounded px-4 py-3 flex flex-col gap-1 bg-muted">
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <span className="font-semibold text-lg">{course.title}</span>
                          {course.level && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded">
                              {course.level}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {course.duration} {course.duration_type}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{course.description}</div>
                    </div>
                  ))}
                </div>
              )}
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

