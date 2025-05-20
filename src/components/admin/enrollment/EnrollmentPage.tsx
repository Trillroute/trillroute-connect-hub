import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useCourseTeachers } from '@/hooks/useCourseTeachers';
import { Copy } from 'lucide-react';

const EnrollmentPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [shouldShowTeacher, setShouldShowTeacher] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();
  const { teachers, loading: teachersLoading } = useCourseTeachers(selectedCourseId);
  const { addStudentToCourse, loading: enrollmentLoading, generatePaymentLink } = useCourseEnrollment();

  // Reset teacher selection when course changes
  useEffect(() => {
    setSelectedTeacherId('');
    setGeneratedLink(null);
    
    if (selectedCourseId) {
      const selectedCourse = courses.find(course => course.id === selectedCourseId);
      
      // Determine if teacher selection should be shown based on course type and duration type
      if (selectedCourse) {
        const isRecurring = selectedCourse.duration_type === 'recurring';
        const isSoloOrDuo = selectedCourse.course_type === 'solo' || selectedCourse.course_type === 'duo';
        
        // Show teacher selection only for recurring solo or duo courses
        setShouldShowTeacher(isRecurring && isSoloOrDuo);
      } else {
        setShouldShowTeacher(false);
      }
    } else {
      setShouldShowTeacher(false);
    }
  }, [selectedCourseId, courses]);

  const handleEnrollStudent = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Please select both a student and a course");
      return;
    }

    setIsEnrolling(true);
    try {
      // Get course data to check if it's a fixed course
      const selectedCourse = courses.find(course => course.id === selectedCourseId);
      const isFixedCourse = selectedCourse?.duration_type === 'fixed';
      const amount = selectedCourse?.final_price || 0;
      
      // Variable to store the generated payment link
      let generatedPaymentLink: string | null = null;
      
      // If fixed course, generate payment link first
      if (isFixedCourse && selectedCourse) {
        generatedPaymentLink = await generatePaymentLink(
          selectedCourseId,
          selectedStudentId, 
          amount
        );
        
        if (generatedPaymentLink) {
          setGeneratedLink(generatedPaymentLink);
        } else {
          // If payment link generation failed, show error but continue
          console.error("Failed to generate payment link, but continuing with enrollment");
        }
      }
      
      const success = await addStudentToCourse(
        selectedCourseId, 
        selectedStudentId, 
        shouldShowTeacher ? selectedTeacherId || undefined : undefined
      );
      
      if (success) {
        // Get student details for the toast message
        const student = students.find(s => s.id === selectedStudentId);
        const course = courses.find(c => c.id === selectedCourseId);
        
        // Use the stored link
        const paymentLink = generatedLink || generatedPaymentLink;
        
        toast.success("Student enrollment processed", {
          description: paymentLink ? (
            <div>
              <p>{student?.first_name} {student?.last_name} has been enrolled in {course?.title}</p>
              {isFixedCourse && (
                <div>
                  <p className="mt-1 text-sm">Payment link sent to {student?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <a 
                      href={paymentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 underline truncate max-w-[200px]"
                    >
                      {paymentLink}
                    </a>
                    <Button
                      variant="outline" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentLink);
                        toast.info("Link copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            `${student?.first_name} ${student?.last_name} has been enrolled in ${course?.title}`
          ),
          action: paymentLink ? {
            label: "Copy Link",
            onClick: () => {
              navigator.clipboard.writeText(paymentLink);
              toast.info("Link copied to clipboard");
            }
          } : undefined,
          duration: paymentLink ? 10000 : 4000, // Longer duration if there's a payment link
        });
        
        // Reset selections after successful enrollment
        setSelectedStudentId('');
        setSelectedCourseId('');
        setSelectedTeacherId('');
        setGeneratedLink(null);
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast.error("Failed to enroll student. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Check if teacher selection should be displayed and if there are available teachers
  const shouldDisplayTeacherField = shouldShowTeacher && teachers && teachers.length > 0;

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
                    {course.title} ({course.course_type}, {course.duration_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Only render the teacher dropdown if it should be displayed */}
          {shouldDisplayTeacherField && (
            <div className="space-y-2">
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select 
                value={selectedTeacherId} 
                onValueChange={setSelectedTeacherId}
                disabled={teachersLoading}
              >
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {generatedLink && (
            <div className="p-3 bg-slate-50 rounded-md border mt-4">
              <p className="text-sm font-medium mb-2">Payment Link Generated</p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={generatedLink}
                  readOnly 
                  className="w-full text-xs bg-white p-2 border rounded truncate"
                />
                <Button
                  variant="outline" 
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    toast.info("Link copied to clipboard");
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
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
