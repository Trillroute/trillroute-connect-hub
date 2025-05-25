
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCourseEnrollment } from '@/hooks/useCourseEnrollment';
import { useStudents } from '@/hooks/useStudents';
import { useCourses } from '@/hooks/useCourses';
import { useCourseTeachers } from '@/hooks/useCourseTeachers';
import { Copy } from 'lucide-react';
import TeacherAvailabilityDialog from './TeacherAvailabilityDialog';
import { UserAvailability } from '@/services/availability/types';
import { fetchEventsBySingleValue } from '@/services/events/api/queries/filter/fetchEventsBySingleValue';

const EnrollmentPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [shouldShowTeacher, setShouldShowTeacher] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedAvailabilitySlot, setSelectedAvailabilitySlot] = useState<UserAvailability | null>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  const { students, loading: studentsLoading } = useStudents();
  const { courses, loading: coursesLoading } = useCourses();
  const { teachers, loading: teachersLoading } = useCourseTeachers(selectedCourseId);
  const { addStudentToCourse, loading: enrollmentLoading, generatePaymentLink } = useCourseEnrollment();

  // Filter courses based on trial completion when student changes
  useEffect(() => {
    const filterCoursesForStudent = async () => {
      if (!selectedStudentId || !courses.length) {
        setAvailableCourses(courses);
        return;
      }

      setLoadingCourses(true);
      try {
        // Fetch all trial booking events for the selected student
        const trialEvents = await fetchEventsBySingleValue('event_type', 'trial_booking');
        
        // Find trials for this specific student
        const studentTrials = trialEvents.filter(event => {
          const metadata = event.metadata;
          if (typeof metadata === 'object' && metadata !== null) {
            return (metadata as any).student_id === selectedStudentId;
          }
          return false;
        });

        // Get course IDs that the student has completed trials for
        const completedTrialCourseIds = studentTrials.map(trial => {
          const metadata = trial.metadata;
          if (typeof metadata === 'object' && metadata !== null) {
            return (metadata as any).course_id;
          }
          return null;
        }).filter(Boolean);

        // Filter courses to only show those with completed trials
        const filteredCourses = courses.filter(course => 
          completedTrialCourseIds.includes(course.id)
        );

        setAvailableCourses(filteredCourses);
      } catch (error) {
        console.error('Error filtering courses by trial completion:', error);
        // On error, show all courses as fallback
        setAvailableCourses(courses);
        toast.error('Failed to check trial completion status');
      } finally {
        setLoadingCourses(false);
      }
    };

    filterCoursesForStudent();
  }, [selectedStudentId, courses]);

  // Reset teacher selection when course changes
  useEffect(() => {
    setSelectedTeacherId('');
    setGeneratedLink(null);
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

    setIsEnrolling(true);
    try {
      // Check if it's a fixed course
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
          console.error("Failed to generate payment link, but continuing with enrollment");
        }
      }
      
      // Additional metadata to include availability slot information if selected
      const additionalMetadata = selectedAvailabilitySlot ? {
        availabilitySlotId: selectedAvailabilitySlot.id,
        dayOfWeek: selectedAvailabilitySlot.dayOfWeek,
        startTime: selectedAvailabilitySlot.startTime,
        endTime: selectedAvailabilitySlot.endTime
      } : undefined;
      
      const success = await addStudentToCourse(
        selectedCourseId, 
        selectedStudentId, 
        shouldShowTeacher ? selectedTeacherId || undefined : undefined,
        additionalMetadata
      );
      
      if (success) {
        // Get student details for the toast message
        const student = students.find(s => s.id === selectedStudentId);
        const course = availableCourses.find(c => c.id === selectedCourseId);
        
        // Use the stored link for the toast message
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
        setSelectedAvailabilitySlot(null);
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      toast.error("Failed to enroll student. Please try again.");
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
  const selectedCourse = selectedCourseId ? availableCourses.find(course => course.id === selectedCourseId) : null;
  const isRecurring = selectedCourse?.duration_type === 'recurring';
  const courseType = selectedCourse?.course_type || '';
  const isGroupRecurring = courseType === 'group' && isRecurring;
  
  // Check if teacher selection should be displayed and if there are available teachers
  const shouldDisplayTeacherField = shouldShowTeacher && teachers && teachers.length > 0;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Enroll Students</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Course Enrollment</CardTitle>
          <CardDescription>Enroll a student in a course (trial completion required)</CardDescription>
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
                  loadingCourses ? "Loading courses..." : 
                  selectedStudentId ? "Select a course" : 
                  "Please select a student first"
                } />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 && selectedStudentId ? (
                  <SelectItem value="" disabled>
                    No courses available (student must complete trial classes first)
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
              <p className="text-sm text-amber-600 mt-1">
                This student must complete trial classes before enrolling in courses.
              </p>
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
            disabled={!selectedStudentId || !selectedCourseId || isEnrolling || enrollmentLoading || availableCourses.length === 0}
          >
            {isEnrolling ? "Enrolling..." : "Enroll Student"}
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
