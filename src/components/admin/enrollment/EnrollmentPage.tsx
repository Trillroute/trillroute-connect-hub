
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';

const EnrollmentPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();
  const { addStudentToCourse, loading: enrollmentLoading } = useCourseEnrollment();

  const handleEnrollStudent = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast({
        title: "Error",
        description: "Please select both a student and a course",
        variant: "destructive"
      });
      return;
    }

    setIsEnrolling(true);
    try {
      const success = await addStudentToCourse(selectedCourseId, selectedStudentId);
      if (success) {
        toast({
          title: "Success",
          description: "Student has been enrolled in the course"
        });
        
        // Reset selections after successful enrollment
        setSelectedStudentId('');
        setSelectedCourseId('');
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast({
        title: "Error",
        description: "Failed to enroll student. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Enroll Students</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Course Enrollment</CardTitle>
          <CardDescription>Enroll a student in a course</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Select Student</Label>
            <Select 
              value={selectedStudentId} 
              onValueChange={setSelectedStudentId}
              disabled={studentsLoading}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.first_name} {student.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <Select 
              value={selectedCourseId} 
              onValueChange={setSelectedCourseId}
              disabled={coursesLoading}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEnrollStudent} 
            className="w-full" 
            disabled={!selectedStudentId || !selectedCourseId || isEnrolling || enrollmentLoading}
          >
            {isEnrolling ? "Enrolling..." : "Enroll Student"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnrollmentPage;
