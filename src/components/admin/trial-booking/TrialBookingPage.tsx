
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useCourseTeachers } from '@/hooks/useCourseTeachers';
import { useTrialBooking } from './hooks/useTrialBooking';
import TeacherAvailabilityDialog from '../enrollment/TeacherAvailabilityDialog';
import { UserAvailability } from '@/services/availability/types';
import { supabase } from '@/integrations/supabase/client';

const TrialBookingPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [shouldShowTeacher, setShouldShowTeacher] = useState(false);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedAvailabilitySlot, setSelectedAvailabilitySlot] = useState<UserAvailability | null>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();
  const { teachers, loading: teachersLoading } = useCourseTeachers(selectedCourseId);
  const { bookTrialClass, loading: bookingLoading } = useTrialBooking();

  // Filter courses based on student's existing trial classes
  useEffect(() => {
    const filterCoursesForStudent = async () => {
      if (!selectedStudentId || !courses.length) {
        setAvailableCourses(courses);
        return;
      }

      setLoadingCourses(true);
      try {
        // Get the student's trial classes from custom_users table
        const { data: studentData, error } = await supabase
          .from('custom_users')
          .select('trial_classes')
          .eq('id', selectedStudentId)
          .single();

        if (error) {
          console.error('Error fetching student trial classes:', error);
          setAvailableCourses(courses);
          return;
        }

        const studentTrialClasses = studentData?.trial_classes || [];
        
        // Filter out courses where student has already taken a trial
        const filteredCourses = courses.filter(course => 
          !studentTrialClasses.includes(course.id)
        );

        setAvailableCourses(filteredCourses);
        
        // Show info if no courses are available
        if (filteredCourses.length === 0 && courses.length > 0) {
          console.info('No courses available for student - trials already taken for all courses', { 
            studentId: selectedStudentId, 
            totalCourses: courses.length,
            trialClassesTaken: studentTrialClasses.length 
          });
        }
      } catch (error) {
        console.error('Error filtering courses by trial status:', error);
        // On error, show all courses as fallback but warn user
        setAvailableCourses(courses);
        toast.error('Failed to check trial status - please verify manually');
      } finally {
        setLoadingCourses(false);
      }
    };

    filterCoursesForStudent();
  }, [selectedStudentId, courses]);

  // Reset teacher selection when course changes
  useEffect(() => {
    setSelectedTeacherId('');
    setSelectedAvailabilitySlot(null);
    
    if (selectedCourseId) {
      const selectedCourse = availableCourses.find(course => course.id === selectedCourseId);
      
      if (selectedCourse) {
        const isRecurring = selectedCourse.duration_type === 'recurring';
        const isSoloOrDuo = selectedCourse.course_type === 'solo' || selectedCourse.course_type === 'duo';
        const isGroupRecurring = selectedCourse.course_type === 'group' && isRecurring;
        
        // Show teacher selection for solo/duo recurring courses
        setShouldShowTeacher(isRecurring && isSoloOrDuo);
      } else {
        setShouldShowTeacher(false);
      }
    } else {
      setShouldShowTeacher(false);
    }
  }, [selectedCourseId, availableCourses]);

  const handleBookTrial = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      toast.error("Please select both a student and a course");
      return;
    }

    // If teacher selection is required but not selected
    if (shouldShowTeacher && !selectedTeacherId) {
      toast.error("Please select a teacher for this course");
      return;
    }

    // Get the selected course details
    const selectedCourse = availableCourses.find(course => course.id === selectedCourseId);
    if (!selectedCourse) {
      toast.error("Course information not found");
      return;
    }
    
    const isRecurring = selectedCourse?.duration_type === 'recurring';
    const isSoloOrDuo = selectedCourse?.course_type === 'solo' || selectedCourse?.course_type === 'duo';
    const isGroupRecurring = selectedCourse?.course_type === 'group' && isRecurring;
    
    // For solo/duo recurring courses with a teacher but no slot selected yet
    if (isRecurring && isSoloOrDuo && selectedTeacherId && !selectedAvailabilitySlot) {
      setShowTeacherDialog(true);
      return;
    }
    
    // For group recurring courses, open dialog to select a common slot for all teachers
    if (isGroupRecurring && !selectedAvailabilitySlot && selectedCourse.instructor_ids?.length > 0) {
      setShowTeacherDialog(true);
      return;
    }

    setIsBooking(true);
    try {
      // Additional metadata to include availability slot information if selected
      const additionalMetadata = selectedAvailabilitySlot ? {
        availabilitySlotId: selectedAvailabilitySlot.id,
        dayOfWeek: selectedAvailabilitySlot.dayOfWeek,
        startTime: selectedAvailabilitySlot.startTime,
        endTime: selectedAvailabilitySlot.endTime
      } : undefined;
      
      const success = await bookTrialClass(
        selectedCourseId, 
        selectedStudentId, 
        shouldShowTeacher ? selectedTeacherId || undefined : undefined,
        additionalMetadata
      );
      
      if (success) {
        // Get student details for the toast message
        const student = students.find(s => s.id === selectedStudentId);
        const course = availableCourses.find(c => c.id === selectedCourseId);
        
        toast.success("Trial class booked successfully", {
          description: `${student?.first_name} ${student?.last_name} has been booked for a trial class in ${course?.title}`,
        });
        
        // Reset selections after successful booking
        setSelectedStudentId('');
        setSelectedCourseId('');
        setSelectedTeacherId('');
        setSelectedAvailabilitySlot(null);
      }
    } catch (error) {
      console.error("Error booking trial class:", error);
      toast.error("Failed to book trial class. Please try again.");
    } finally {
      setIsBooking(false);
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
    
    // Continue with booking now that we have the slot
    setTimeout(() => {
      handleBookTrial();
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
  const selectedCourse = selectedCourseId ? availableCourses.find(course => course.id === selectedCourseId) : null;
  const isRecurring = selectedCourse?.duration_type === 'recurring';
  const courseType = selectedCourse?.course_type || '';
  const isGroupRecurring = courseType === 'group' && isRecurring;
  
  // Check if teacher selection should be displayed and if there are available teachers
  const shouldDisplayTeacherField = shouldShowTeacher && teachers && teachers.length > 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Book Trial Classes</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Trial Class Booking</CardTitle>
          <CardDescription>Book a trial class for a student</CardDescription>
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
              disabled={coursesLoading || loadingCourses}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder={
                  loadingCourses ? "Checking available courses..." : 
                  selectedStudentId ? "Select a course" : 
                  "Please select a student first"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 && selectedStudentId && !loadingCourses ? (
                  <SelectItem value="no-courses-available" disabled>
                    No courses available (trials already taken)
                  </SelectItem>
                ) : (
                  availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} ({course.course_type}, {course.duration_type})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {selectedStudentId && availableCourses.length === 0 && !loadingCourses && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  This student has already taken trial classes for all available courses.
                </p>
              </div>
            )}
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
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleBookTrial} 
            className="w-full" 
            disabled={!selectedStudentId || !selectedCourseId || isBooking || bookingLoading || availableCourses.length === 0}
          >
            {isBooking ? "Booking..." : "Book Trial Class"}
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

export default TrialBookingPage;
