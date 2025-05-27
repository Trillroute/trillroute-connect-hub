
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useCourseTeachers } from '@/hooks/useCourseTeachers';
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import TeacherAvailabilityDialog from './TeacherAvailabilityDialog';
import { EnrollmentForm } from './components/EnrollmentForm';
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
      
      const coursePrice = selectedCourse.final_price || 0;
      console.log('Course price:', coursePrice);
      
      // Handle free courses differently
      if (coursePrice === 0) {
        console.log('Processing free course enrollment');
        
        // For free courses, directly enroll the student
        const enrollmentSuccess = await addStudentToCourse(
          selectedCourseId,
          selectedStudentId,
          selectedTeacherId,
          additionalMetadata
        );
        
        if (enrollmentSuccess) {
          const student = students.find(s => s.id === selectedStudentId);
          const course = courses.find(c => c.id === selectedCourseId);
          
          toast.success("Student enrolled successfully!", {
            description: `${student?.first_name} ${student?.last_name} has been enrolled in ${course?.title}`,
          });
          
          // Reset selections after successful enrollment
          setSelectedStudentId('');
          setSelectedCourseId('');
          setSelectedTeacherId('');
          setSelectedAvailabilitySlot(null);
        } else {
          toast.error('Failed to enroll student in free course');
        }
      } else {
        // For paid courses, generate payment link
        console.log('Generating payment link for paid course, amount:', coursePrice);
        const paymentLink = await generatePaymentLink(
          selectedCourseId, 
          selectedStudentId, 
          coursePrice
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
      }
      
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
          <CardDescription>Enroll students in courses (free or paid)</CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentForm
            students={students}
            courses={courses}
            teachers={teachers}
            studentsLoading={studentsLoading}
            coursesLoading={coursesLoading}
            teachersLoading={teachersLoading}
            selectedStudentId={selectedStudentId}
            selectedCourseId={selectedCourseId}
            selectedTeacherId={selectedTeacherId}
            selectedAvailabilitySlot={selectedAvailabilitySlot}
            setSelectedStudentId={setSelectedStudentId}
            setSelectedCourseId={setSelectedCourseId}
            setSelectedTeacherId={setSelectedTeacherId}
            onChangeTimeSlot={() => setShowTeacherDialog(true)}
            selectedCourse={selectedCourse}
            shouldDisplayTeacherField={shouldDisplayTeacherField}
            isGroupRecurring={isGroupRecurring}
          />
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEnrollStudent} 
            className="w-full" 
            disabled={!selectedStudentId || !selectedCourseId || isEnrolling || enrollmentLoading}
          >
            {isEnrolling ? "Processing..." : selectedCourse?.final_price === 0 ? "Enroll Student (Free)" : "Generate Payment Link"}
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
