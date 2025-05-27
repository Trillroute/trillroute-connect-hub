
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useCourseTeachers } from '@/hooks/useCourseTeachers';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import TeacherAvailabilityDialog from './TeacherAvailabilityDialog';
import { UserAvailability } from '@/services/availability/types';

const EnrollmentPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [shouldShowTeacher, setShouldShowTeacher] = useState(false);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedAvailabilitySlot, setSelectedAvailabilitySlot] = useState<UserAvailability | null>(null);
  
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();
  const { teachers, loading: teachersLoading } = useCourseTeachers(selectedCourseId);
  const { addStudentToCourse, generatePaymentLink, loading: enrollmentLoading, hasCompletedTrialForCourse } = useCourseEnrollment();

  // Reset teacher selection when course changes
  useEffect(() => {
    setSelectedTeacherId('');
    setSelectedAvailabilitySlot(null);
    
    if (selectedCourseId) {
      const selectedCourse = courses.find(course => course.id === selectedCourseId);
      
      if (selectedCourse) {
        const isRecurring = selectedCourse.duration_type === 'recurring';
        const isSoloOrDuo = selectedCourse.course_type === 'solo' || selectedCourse.course_type === 'duo';
        
        // Show teacher selection for solo/duo recurring courses
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

    // If teacher selection is required but not selected
    if (shouldShowTeacher && !selectedTeacherId) {
      toast.error("Please select a teacher for this course");
      return;
    }

    // Get the selected course details for pricing
    const selectedCourse = courses.find(course => course.id === selectedCourseId);
    if (!selectedCourse) {
      toast.error("Course information not found");
      return;
    }

    const isRecurring = selectedCourse?.duration_type === 'recurring';
    const isSoloOrDuo = selectedCourse?.course_type === 'solo' || selectedCourse?.course_type === 'duo';
    
    // For solo/duo recurring courses with a teacher but no slot selected yet
    if (isRecurring && isSoloOrDuo && selectedTeacherId && !selectedAvailabilitySlot) {
      setShowTeacherDialog(true);
      return;
    }

    setIsEnrolling(true);
    try {
      console.log('Starting enrollment process for student:', selectedStudentId, 'course:', selectedCourseId);
      
      // First check if the student has completed the trial for this course
      const hasTrialCompleted = await hasCompletedTrialForCourse(selectedStudentId, selectedCourseId);
      console.log('Trial completion check result:', hasTrialCompleted);
      
      if (!hasTrialCompleted) {
        toast.error('Student must complete a trial class for this course before enrollment');
        setIsEnrolling(false);
        return;
      }

      // Additional metadata to include availability slot information if selected
      const additionalMetadata = selectedAvailabilitySlot ? {
        availabilitySlotId: selectedAvailabilitySlot.id,
        dayOfWeek: selectedAvailabilitySlot.dayOfWeek,
        startTime: selectedAvailabilitySlot.startTime,
        endTime: selectedAvailabilitySlot.endTime
      } : undefined;
      
      // Generate payment link first
      console.log('Generating payment link for course:', selectedCourse.title, 'Amount:', selectedCourse.final_price);
      const paymentLink = await generatePaymentLink(
        selectedCourseId, 
        selectedStudentId, 
        selectedCourse.final_price || 0
      );
      
      if (!paymentLink) {
        console.error('Payment link generation failed');
        toast.error('Failed to generate payment link. Please try again.');
        setIsEnrolling(false);
        return;
      }

      console.log('Payment link generated successfully:', paymentLink);
      
      // Open payment link in new window/tab
      window.open(paymentLink, '_blank');
      
      // Show success message
      const student = students.find(s => s.id === selectedStudentId);
      const course = courses.find(c => c.id === selectedCourseId);
      
      toast.success("Payment link generated successfully", {
        description: `Payment link opened for ${student?.first_name} ${student?.last_name} to enroll in ${course?.title}`,
      });
      
      // Reset selections after successful generation
      setSelectedStudentId('');
      setSelectedCourseId('');
      setSelectedTeacherId('');
      setSelectedAvailabilitySlot(null);
      
    } catch (error) {
      console.error("Error during enrollment process:", error);
      toast.error("Failed to process enrollment. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  // Handle availability slot selection
  const handleTimeSlotSelect = (slot: UserAvailability) => {
    setSelectedAvailabilitySlot(slot);
    setShowTeacherDialog(false);
    
    // Show success message
    toast.success("Time slot selected", {
      description: `Selected ${getDayName(slot.dayOfWeek)} from ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}`,
    });
    
    // Continue with enrollment now that we have the slot
    setTimeout(() => {
      handleEnrollStudent();
    }, 500);
  };
  
  // Helper functions
  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Get course details for form state
  const selectedCourse = selectedCourseId ? courses.find(course => course.id === selectedCourseId) : null;
  const isRecurring = selectedCourse?.duration_type === 'recurring';
  const courseType = selectedCourse?.course_type || '';
  const isGroupRecurring = courseType === 'group' && isRecurring;
  
  // Check if teacher selection should be displayed and if there are available teachers
  const shouldDisplayTeacherField = shouldShowTeacher && teachers && teachers.length > 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Enroll Students in Courses</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Student Enrollment</CardTitle>
          <CardDescription>Generate payment link for student course enrollment</CardDescription>
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
                    {course.title} ({course.course_type}, {course.duration_type}) - ₹{course.final_price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
          
          {selectedAvailabilitySlot && (
            <div className="p-3 bg-slate-50 rounded-md border">
              <p className="text-sm font-medium">Selected Time Slot</p>
              <p className="text-xs text-gray-600 mt-1">
                {getDayName(selectedAvailabilitySlot.dayOfWeek)}, {formatTime(selectedAvailabilitySlot.startTime)} - {formatTime(selectedAvailabilitySlot.endTime)}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs mt-1 h-7 px-2" 
                onClick={() => setShowTeacherDialog(true)}
              >
                Change Slot
              </Button>
            </div>
          )}
          
          {isGroupRecurring && !selectedAvailabilitySlot && selectedCourse?.instructor_ids?.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-amber-800">
                This is a recurring group course. You'll need to select a time slot where all teachers are available.
              </p>
            </div>
          )}
          
          {selectedCourse && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm font-medium">Course Details</p>
              <p className="text-xs text-gray-600 mt-1">
                {selectedCourse.title} - ₹{selectedCourse.final_price}
              </p>
              <p className="text-xs text-gray-500">
                {selectedCourse.course_type} course, {selectedCourse.duration_type} duration
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEnrollStudent} 
            className="w-full" 
            disabled={!selectedStudentId || !selectedCourseId || isEnrolling || enrollmentLoading}
          >
            {isEnrolling ? "Processing..." : "Generate Payment Link"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Teacher availability dialog */}
      {showTeacherDialog && (
        <TeacherAvailabilityDialog
          open={showTeacherDialog}
          onClose={() => setShowTeacherDialog(false)}
          teacherId={selectedTeacherId}
          onSlotSelect={handleTimeSlotSelect}
          isGroupCourse={isGroupRecurring}
          courseId={isGroupRecurring ? selectedCourseId : undefined}
        />
      )}
    </div>
  );
};

export default EnrollmentPage;
